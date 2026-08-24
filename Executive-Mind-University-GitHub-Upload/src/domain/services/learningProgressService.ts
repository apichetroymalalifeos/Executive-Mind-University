import type {
  ActionContract,
  ActionContractStatus,
  AppDataEnvelope,
  DailyReviewEntry,
  DecisionCanvasResponse,
  ExerciseRecord,
  LessonProgressRecord,
  QuizAttempt,
  QuizQuestion
} from '../entities/appData';
import type { LessonContent } from '../../content/lessons/lessonTypes';
import { createEmptyDecisionCanvas } from '../../infrastructure/storage/defaultData';
import { createId } from '../../utils/createId';

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateSectionProgress(completedSectionIds: string[], totalSections: number): number {
  if (totalSections <= 0) {
    return 0;
  }
  return Math.round((new Set(completedSectionIds).size / totalSections) * 100);
}

export interface AppliedCompletionGate {
  canComplete: boolean;
  missingRequirements: string[];
  completedRequirements: string[];
  nextRequiredAction: string;
}

export function getAppliedCompletionGate(data: AppDataEnvelope, lesson: LessonContent): AppliedCompletionGate {
  const exerciseComplete = data.curriculumProgress.exerciseStatus[lesson.id] === 'completed';
  const quizComplete = data.quizAttempts.some((attempt) => attempt.lessonId === lesson.id);
  const dailyReviewComplete = data.dailyReviews.some(
    (review) => review.lessonId === lesson.id && review.status === 'completed'
  );
  const actionContract = data.reviews
    .filter((contract) => contract.lessonId === lesson.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const hasRealAction = Boolean(
    actionContract &&
      actionContract.status !== 'skipped' &&
      actionContract.what.trim() &&
      actionContract.when.trim() &&
      actionContract.minimumAcceptableAction.trim() &&
      actionContract.evidenceOfCompletion.trim()
  );

  const missingRequirements: string[] = [];
  const completedRequirements: string[] = [];

  if (exerciseComplete) {
    completedRequirements.push('Decision Canvas เสร็จแล้ว');
  } else {
    missingRequirements.push('ทำ Decision Canvas อย่างน้อยช่องบังคับ');
  }

  if (quizComplete) {
    completedRequirements.push('Quiz เสร็จแล้ว');
  } else {
    missingRequirements.push('ทำ Quiz เพื่อจับ weak area');
  }

  if (hasRealAction) {
    completedRequirements.push('มี Action Contract จริงภายใน 24 ชั่วโมง');
  } else {
    missingRequirements.push('สร้าง Action Contract ที่มี action, เวลา, minimum action และหลักฐานว่าเสร็จ');
  }

  if (dailyReviewComplete) {
    completedRequirements.push('Daily Review เสร็จแล้ว');
  } else {
    missingRequirements.push('เขียน Daily Review อย่างน้อยหนึ่งรอบ');
  }

  return {
    canComplete: hasRealAction && exerciseComplete && quizComplete && dailyReviewComplete,
    missingRequirements,
    completedRequirements,
    nextRequiredAction:
      missingRequirements[0] ??
      'ลงมือทำ Action Contract ภายใน 24 ชั่วโมง แล้วกลับมาทบทวนผลจริง'
  };
}

export function calculateNextStreak(lastStudyDate: string | null, today: string, currentStreak: number): number {
  if (lastStudyDate === today) {
    return currentStreak;
  }
  if (lastStudyDate === null) {
    return 1;
  }
  const previous = new Date(`${lastStudyDate}T00:00:00`);
  const current = new Date(`${today}T00:00:00`);
  const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);
  return diffDays === 1 ? currentStreak + 1 : 1;
}

export function startLesson(data: AppDataEnvelope, lesson: LessonContent, now = new Date()): AppDataEnvelope {
  const timestamp = now.toISOString();
  const today = getLocalDateKey(now);
  const existing = data.lessonProgress.find((progress) => progress.lessonId === lesson.id);
  const firstSectionId = lesson.sections[0]?.id ?? '';
  const lessonProgress = existing
    ? data.lessonProgress
    : [
        ...data.lessonProgress,
        {
          lessonId: lesson.id,
          currentSectionId: firstSectionId,
          completedSectionIds: [],
          audioSectionId: firstSectionId,
          lessonStartedAt: timestamp,
          lessonCompletedAt: null,
          actualLearningMinutes: 0,
          updatedAt: timestamp
        }
      ];

  return {
    ...data,
    updatedAt: timestamp,
    lessonProgress,
    curriculumProgress: {
      ...data.curriculumProgress,
      currentLessonId: lesson.id,
      currentSectionId: existing?.currentSectionId ?? firstSectionId,
      lessonStartedAt: {
        ...data.curriculumProgress.lessonStartedAt,
        [lesson.id]: data.curriculumProgress.lessonStartedAt[lesson.id] ?? timestamp
      },
      lastLearningDate: today,
      learningStreakDays: calculateNextStreak(
        data.curriculumProgress.lastLearningDate,
        today,
        data.curriculumProgress.learningStreakDays
      )
    }
  };
}

export function setCurrentSection(data: AppDataEnvelope, lessonId: string, sectionId: string): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  return {
    ...data,
    updatedAt: timestamp,
    lessonProgress: data.lessonProgress.map((progress) =>
      progress.lessonId === lessonId
        ? { ...progress, currentSectionId: sectionId, audioSectionId: sectionId, updatedAt: timestamp }
        : progress
    ),
    curriculumProgress: {
      ...data.curriculumProgress,
      currentLessonId: lessonId,
      currentSectionId: sectionId
    }
  };
}

export function markSectionComplete(data: AppDataEnvelope, lessonId: string, sectionId: string): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  const nextProgress = data.lessonProgress.map((progress) => {
    if (progress.lessonId !== lessonId) {
      return progress;
    }
    const completedSectionIds = Array.from(new Set([...progress.completedSectionIds, sectionId]));
    return { ...progress, completedSectionIds, updatedAt: timestamp };
  });
  const previous = data.curriculumProgress.completedSectionIds[lessonId] ?? [];
  return {
    ...data,
    updatedAt: timestamp,
    lessonProgress: nextProgress,
    curriculumProgress: {
      ...data.curriculumProgress,
      completedSectionIds: {
        ...data.curriculumProgress.completedSectionIds,
        [lessonId]: Array.from(new Set([...previous, sectionId]))
      }
    }
  };
}

export function getOrCreateExercise(data: AppDataEnvelope, lessonId: string): ExerciseRecord {
  return (
    data.exercises.find((exercise) => exercise.lessonId === lessonId) ?? {
      id: createId('exercise'),
      lessonId,
      prompt: 'Decision Canvas',
      response: '',
      fields: createEmptyDecisionCanvas(),
      status: 'not_started',
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );
}

export function saveExerciseDraft(
  data: AppDataEnvelope,
  lessonId: string,
  fields: DecisionCanvasResponse,
  complete = false
): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  const existing = data.exercises.find((exercise) => exercise.lessonId === lessonId);
  const response = JSON.stringify(fields);
  const exercise: ExerciseRecord = {
    ...(existing ?? getOrCreateExercise(data, lessonId)),
    fields,
    response,
    status: complete ? 'completed' : 'draft',
    completedAt: complete ? timestamp : existing?.completedAt ?? null,
    updatedAt: timestamp
  };
  return {
    ...data,
    updatedAt: timestamp,
    exercises: existing
      ? data.exercises.map((item) => (item.id === exercise.id ? exercise : item))
      : [...data.exercises, exercise],
    curriculumProgress: {
      ...data.curriculumProgress,
      exerciseStatus: {
        ...data.curriculumProgress.exerciseStatus,
        [lessonId]: exercise.status
      }
    }
  };
}

export function scoreQuiz(
  questions: QuizQuestion[],
  answers: Record<string, string>
): { score: number; weakConcepts: string[] } {
  const graded = questions.filter((question) => question.correctAnswerId !== null);
  const correct = graded.filter((question) => answers[question.id] === question.correctAnswerId).length;
  const weakConcepts = questions
    .filter((question) => question.correctAnswerId !== null && answers[question.id] !== question.correctAnswerId)
    .map((question) => question.weakConcept);
  return {
    score: graded.length === 0 ? 0 : Math.round((correct / graded.length) * 100),
    weakConcepts
  };
}

export function saveQuizAttempt(
  data: AppDataEnvelope,
  lessonId: string,
  questions: QuizQuestion[],
  answers: Record<string, string>
): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  const result = scoreQuiz(questions, answers);
  const attempt: QuizAttempt = {
    id: createId('quiz'),
    lessonId,
    answers,
    score: result.score,
    weakConcepts: result.weakConcepts,
    completedAt: timestamp
  };
  const weakAreas = { ...data.curriculumProgress.weakAreas };
  const strongAreas = { ...data.curriculumProgress.strongAreas };
  result.weakConcepts.forEach((concept) => {
    weakAreas[concept] = (weakAreas[concept] ?? 0) + 1;
  });
  questions
    .filter((question) => question.correctAnswerId !== null && answers[question.id] === question.correctAnswerId)
    .forEach((question) => {
      strongAreas[question.weakConcept] = (strongAreas[question.weakConcept] ?? 0) + 1;
    });

  return {
    ...data,
    updatedAt: timestamp,
    quizAttempts: [...data.quizAttempts, attempt],
    curriculumProgress: {
      ...data.curriculumProgress,
      quizScores: {
        ...data.curriculumProgress.quizScores,
        [lessonId]: [...(data.curriculumProgress.quizScores[lessonId] ?? []), result.score]
      },
      latestQuizScore: {
        ...data.curriculumProgress.latestQuizScore,
        [lessonId]: result.score
      },
      weakAreas,
      strongAreas
    }
  };
}

export function upsertActionContract(
  data: AppDataEnvelope,
  lessonId: string,
  input: Omit<ActionContract, 'id' | 'lessonId' | 'completedAt' | 'updatedAt'> & {
    id?: string;
    completedAt?: string | null;
  }
): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  const id = input.id ?? createId('action');
  const contract: ActionContract = {
    id,
    lessonId,
    what: input.what,
    whyItMatters: input.whyItMatters,
    when: input.when,
    minimumAcceptableAction: input.minimumAcceptableAction,
    evidenceOfCompletion: input.evidenceOfCompletion,
    reviewDate: input.reviewDate,
    status: input.status,
    completedAt: input.completedAt ?? null,
    outcomeReview: input.outcomeReview,
    updatedAt: timestamp
  };
  const exists = data.reviews.some((item) => item.id === id);
  return {
    ...data,
    updatedAt: timestamp,
    reviews: exists ? data.reviews.map((item) => (item.id === id ? contract : item)) : [...data.reviews, contract],
    curriculumProgress: {
      ...data.curriculumProgress,
      actionContractStatus: {
        ...data.curriculumProgress.actionContractStatus,
        [lessonId]: contract.status
      }
    }
  };
}

export function updateActionStatus(
  data: AppDataEnvelope,
  actionId: string,
  status: ActionContractStatus,
  outcomeReview?: string
): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  let lessonId: string | null = null;
  const reviews = data.reviews.map((contract) => {
    if (contract.id !== actionId) {
      return contract;
    }
    lessonId = contract.lessonId;
    return {
      ...contract,
      status,
      completedAt: status === 'completed' ? timestamp : contract.completedAt,
      outcomeReview: outcomeReview ?? contract.outcomeReview,
      updatedAt: timestamp
    };
  });
  return {
    ...data,
    updatedAt: timestamp,
    reviews,
    curriculumProgress: lessonId
      ? {
          ...data.curriculumProgress,
          actionContractStatus: {
            ...data.curriculumProgress.actionContractStatus,
            [lessonId]: status
          }
        }
      : data.curriculumProgress
  };
}

export function saveDailyReview(
  data: AppDataEnvelope,
  review: Omit<DailyReviewEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): AppDataEnvelope {
  const timestamp = new Date().toISOString();
  const existing = review.id ? data.dailyReviews.find((item) => item.id === review.id) : undefined;
  const next: DailyReviewEntry = {
    ...review,
    id: review.id ?? createId('daily-review'),
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp
  };
  return {
    ...data,
    updatedAt: timestamp,
    dailyReviews: existing
      ? data.dailyReviews.map((item) => (item.id === next.id ? next : item))
      : [...data.dailyReviews, next]
  };
}

export function markLessonComplete(
  data: AppDataEnvelope,
  lesson: LessonContent,
  minutes: number,
  now = new Date()
): AppDataEnvelope {
  const timestamp = now.toISOString();
  const completedLessonIds = Array.from(new Set([...data.curriculumProgress.completedLessonIds, lesson.id]));
  const completedSectionIds = lesson.sections.map((section) => section.id);
  const today = getLocalDateKey(now);
  return {
    ...data,
    updatedAt: timestamp,
    lessonProgress: data.lessonProgress.map((progress) =>
      progress.lessonId === lesson.id
        ? {
            ...progress,
            completedSectionIds,
            lessonCompletedAt: timestamp,
            actualLearningMinutes: Math.max(progress.actualLearningMinutes, minutes),
            updatedAt: timestamp
          }
        : progress
    ),
    curriculumProgress: {
      ...data.curriculumProgress,
      completedLessonIds,
      completedSectionIds: {
        ...data.curriculumProgress.completedSectionIds,
        [lesson.id]: completedSectionIds
      },
      lessonCompletedAt: {
        ...data.curriculumProgress.lessonCompletedAt,
        [lesson.id]: timestamp
      },
      totalLearningMinutes: data.curriculumProgress.totalLearningMinutes + minutes,
      lastLearningDate: today,
      learningStreakDays: calculateNextStreak(
        data.curriculumProgress.lastLearningDate,
        today,
        data.curriculumProgress.learningStreakDays
      )
    }
  };
}

export function getLessonProgress(data: AppDataEnvelope, lessonId: string): LessonProgressRecord | null {
  return data.lessonProgress.find((progress) => progress.lessonId === lessonId) ?? null;
}
