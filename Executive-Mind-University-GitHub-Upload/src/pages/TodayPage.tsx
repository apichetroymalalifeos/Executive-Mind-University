import { useMemo, useState } from 'react';
import { AudioMode } from '../components/learning/AudioMode';
import { ActionContractPanel } from '../components/learning/ActionContractPanel';
import { DailyReviewPanel } from '../components/learning/DailyReviewPanel';
import { DailyHabitGuide } from '../components/learning/DailyHabitGuide';
import { DecisionCanvas } from '../components/learning/DecisionCanvas';
import { LessonReader } from '../components/learning/LessonReader';
import { QuizPanel } from '../components/learning/QuizPanel';
import { getPrimaryLesson } from '../content/lessons/lessonRepository';
import type { ActionContract, AppDataEnvelope, DecisionCanvasResponse } from '../domain/entities/appData';
import { createDailyHabitPlan } from '../domain/services/dailyHabitService';
import {
  calculateSectionProgress,
  getLessonProgress,
  getOrCreateExercise,
  markLessonComplete,
  markSectionComplete,
  saveDailyReview,
  saveExerciseDraft,
  saveQuizAttempt,
  setCurrentSection,
  startLesson,
  updateActionStatus,
  upsertActionContract
} from '../domain/services/learningProgressService';
import { createEmptyDecisionCanvas } from '../infrastructure/storage/defaultData';

interface TodayPageProps {
  data: AppDataEnvelope;
  onSave: (data: AppDataEnvelope) => void;
}

export function TodayPage({ data, onSave }: TodayPageProps) {
  const lesson = getPrimaryLesson();
  const progress = getLessonProgress(data, lesson.id);
  const firstSection = useMemo(
    () =>
      lesson.sections[0] ?? {
        id: 'empty',
        title: 'ยังไม่มี section',
        estimatedMinutes: 0,
        content: '',
        audioText: '',
        keyTakeaway: ''
      },
    [lesson.sections]
  );
  const currentSectionId = progress?.currentSectionId ?? firstSection.id;
  const completedSectionIds = progress?.completedSectionIds ?? [];
  const progressPercentage = calculateSectionProgress(completedSectionIds, lesson.sections.length);
  const exercise = data.exercises.find((item) => item.lessonId === lesson.id) ?? null;
  const activeAction =
    data.reviews.find((contract) => contract.lessonId === lesson.id && contract.status !== 'completed') ??
    data.reviews.find((contract) => contract.lessonId === lesson.id) ??
    null;
  const dailyReview = data.dailyReviews.find((review) => review.lessonId === lesson.id) ?? null;
  const quizAttempts = data.quizAttempts.filter((attempt) => attempt.lessonId === lesson.id);
  const latestQuiz = quizAttempts[quizAttempts.length - 1] ?? null;
  const habitPlan = createDailyHabitPlan(data);
  const [showAudio, setShowAudio] = useState(false);

  const currentSection = useMemo(
    () => lesson.sections.find((section) => section.id === currentSectionId) ?? firstSection,
    [currentSectionId, firstSection, lesson.sections]
  );

  function save(nextData: AppDataEnvelope): void {
    onSave(nextData);
  }

  function handleStart(): void {
    save(startLesson(data, lesson));
  }

  function handleSectionChange(sectionId: string): void {
    const started = progress ? data : startLesson(data, lesson);
    save(setCurrentSection(started, lesson.id, sectionId));
  }

  function handleSectionComplete(sectionId: string): void {
    save(markSectionComplete(data, lesson.id, sectionId));
  }

  function handleExerciseSave(fields: DecisionCanvasResponse, complete: boolean): void {
    save(saveExerciseDraft(data, lesson.id, fields, complete));
  }

  function handleExerciseClear(): void {
    save(saveExerciseDraft(data, lesson.id, createEmptyDecisionCanvas(), false));
  }

  function handleQuizSubmit(answers: Record<string, string>): void {
    save(saveQuizAttempt(data, lesson.id, lesson.quiz, answers));
  }

  function handleActionSave(
    input: Omit<ActionContract, 'id' | 'lessonId' | 'completedAt' | 'updatedAt'> & {
      id?: string;
      completedAt?: string | null;
    }
  ): void {
    save(upsertActionContract(data, lesson.id, input));
  }

  function handleMarkComplete(): void {
    const exerciseComplete = data.curriculumProgress.exerciseStatus[lesson.id] === 'completed';
    const quizComplete = data.quizAttempts.some((attempt) => attempt.lessonId === lesson.id);
    if ((!exerciseComplete || !quizComplete) && !window.confirm('แบบฝึกหัดหรือ quiz ยังไม่ครบ ต้องการจบบทเรียนนี้เลยหรือไม่?')) {
      return;
    }
    save(markLessonComplete(data, lesson, lesson.estimatedMinutes));
  }

  const started = Boolean(progress);
  const completed = data.curriculumProgress.completedLessonIds.includes(lesson.id);

  return (
    <section className="page-stack" aria-labelledby="today-title">
      <div className="hero-panel compact-hero">
        <p className="eyebrow">
          บทที่ {lesson.lessonNumber} | {lesson.facultyTitle}
        </p>
        <h2 id="today-title">{lesson.titleThai}</h2>
        <p>{lesson.whyItMatters}</p>
        <div className="metric-grid">
          <div>
            <span>เวลาเรียน</span>
            <strong>{lesson.estimatedMinutes} นาที</strong>
          </div>
          <div>
            <span>ความคืบหน้า</span>
            <strong>{progressPercentage}%</strong>
          </div>
          <div>
            <span>Section ปัจจุบัน</span>
            <strong>{currentSection.title}</strong>
          </div>
          <div>
            <span>Quiz</span>
            <strong>{latestQuiz ? `${latestQuiz.score}%` : 'ยังไม่ได้ทำ'}</strong>
          </div>
        </div>
        <div className="reader-actions">
          <button type="button" className="primary-action" onClick={handleStart}>
            {started ? 'เรียนต่อ' : 'เริ่มเรียน'}
          </button>
          <button type="button" className="secondary-action" onClick={() => setShowAudio((value) => !value)}>
            โหมดฟัง
          </button>
          <button type="button" className="primary-action" onClick={handleMarkComplete}>
            {completed ? 'เรียนจบแล้ว' : 'บันทึกว่าเรียนจบ'}
          </button>
        </div>
        {completed ? (
          <p className="status-note">บทเรียนนี้จบแล้ว ขั้นต่อไปคือทบทวน Action Contract และลงมือภายใน 24 ชั่วโมง</p>
        ) : null}
      </div>

      <DailyHabitGuide plan={habitPlan} />

      {showAudio ? (
        <AudioMode
          sections={lesson.sections}
          currentSectionId={currentSectionId}
          speed={data.settings.audioSpeed}
          onSectionChange={handleSectionChange}
          onSpeedChange={(speed) => save({ ...data, settings: { ...data.settings, audioSpeed: speed } })}
        />
      ) : null}

      <LessonReader
        lesson={lesson}
        currentSectionId={currentSectionId}
        completedSectionIds={completedSectionIds}
        onSectionChange={handleSectionChange}
        onSectionComplete={handleSectionComplete}
      />

      <DecisionCanvas
        exercise={exercise ?? getOrCreateExercise(data, lesson.id)}
        onSave={handleExerciseSave}
        onClear={handleExerciseClear}
      />

      <QuizPanel lessonId={lesson.id} questions={lesson.quiz} attempts={data.quizAttempts} onSubmit={handleQuizSubmit} />

      <ActionContractPanel
        contract={activeAction}
        onSave={handleActionSave}
        onStatusChange={(id, status, outcome) => save(updateActionStatus(data, id, status, outcome))}
      />

      <DailyReviewPanel
        review={dailyReview}
        actionContractId={activeAction?.id ?? null}
        onSave={(review) => save(saveDailyReview(data, review))}
      />
    </section>
  );
}
