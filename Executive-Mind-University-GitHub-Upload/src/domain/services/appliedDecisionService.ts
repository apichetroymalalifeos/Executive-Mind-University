import type { ActionContract, AppDataEnvelope } from '../entities/appData';

export interface AppliedDecisionScorecard {
  score: number;
  level: 'ยังไม่เริ่ม' | 'เริ่มเรียน' | 'เริ่มนำไปใช้' | 'ใช้จริงแล้ว' | 'ปรับปรุงจากผลจริง';
  completedSignals: string[];
  missingSignals: string[];
  actionCompletionRate: number;
  reviewedActionCount: number;
  completedActionCount: number;
  dailyReviewCount: number;
  appliedDecisionCount: number;
  nextImprovement: string;
}

export interface WeeklyAppliedReviewSummary {
  windowLabel: string;
  actionsCreated: number;
  actionsCompleted: number;
  actionsWaitingReview: number;
  dailyReviewsCompleted: number;
  quizAttempts: number;
  learningMinutes: number;
  strongestSignal: string;
  nextReviewFocus: string;
}

export function createAppliedDecisionScorecard(data: AppDataEnvelope): AppliedDecisionScorecard {
  const completedSignals: string[] = [];
  const missingSignals: string[] = [];
  const completedActions = data.reviews.filter((contract) => contract.status === 'completed');
  const reviewedActions = completedActions.filter((contract) => hasText(contract.outcomeReview));
  const actionCompletionRate =
    data.reviews.length === 0 ? 0 : Math.round((completedActions.length / data.reviews.length) * 100);
  const completedDailyReviews = data.dailyReviews.filter((review) => review.status === 'completed');
  const completedExercises = data.exercises.filter((exercise) => exercise.status === 'completed');
  const reviewedDecisions = data.decisions.filter((decision) => hasText(decision.actualOutcome));

  addSignal(
    completedExercises.length > 0,
    'มี Decision Canvas ที่ทำเสร็จ',
    'ทำ Decision Canvas ให้จบอย่างน้อย 1 เรื่อง',
    completedSignals,
    missingSignals
  );
  addSignal(
    data.quizAttempts.length > 0,
    'มี Quiz เพื่อจับ weak area',
    'ทำ Quiz เพื่อดูว่าควรฝึกวิธีคิดจุดไหน',
    completedSignals,
    missingSignals
  );
  addSignal(
    data.reviews.some(isRealActionContract),
    'มี Action Contract ที่ลงมือได้จริง',
    'สร้าง Action Contract ที่มี action, เวลา, minimum action และหลักฐานว่าเสร็จ',
    completedSignals,
    missingSignals
  );
  addSignal(
    completedActions.length > 0,
    'มี Action ที่ทำเสร็จแล้ว',
    'ทำ Action Contract อย่างน้อย 1 รายการให้เสร็จ',
    completedSignals,
    missingSignals
  );
  addSignal(
    reviewedActions.length > 0 || reviewedDecisions.length > 0,
    'มีการทบทวนผลจริงหลังลงมือ',
    'กลับมาเขียน outcome review เพื่อแยก process ดีออกจากโชค',
    completedSignals,
    missingSignals
  );
  addSignal(
    completedDailyReviews.length > 0,
    'มี Daily Review หลังเรียน',
    'เขียน Daily Review ให้จบหนึ่งรอบ',
    completedSignals,
    missingSignals
  );

  const score = Math.min(100, Math.round((completedSignals.length / 6) * 100));

  return {
    score,
    level: getScoreLevel(score, reviewedActions.length + reviewedDecisions.length),
    completedSignals,
    missingSignals,
    actionCompletionRate,
    reviewedActionCount: reviewedActions.length + reviewedDecisions.length,
    completedActionCount: completedActions.length,
    dailyReviewCount: completedDailyReviews.length,
    appliedDecisionCount: data.reviews.filter(isRealActionContract).length + reviewedDecisions.length,
    nextImprovement: missingSignals[0] ?? 'เลือก Action ที่ทำแล้วกลับมาทบทวนผลจริง เพื่อยกระดับคุณภาพการตัดสินใจ'
  };
}

export function createWeeklyAppliedReviewSummary(
  data: AppDataEnvelope,
  now = new Date()
): WeeklyAppliedReviewSummary {
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 6);
  windowStart.setHours(0, 0, 0, 0);
  const actions = data.reviews.filter((contract) => isOnOrAfter(contract.updatedAt, windowStart));
  const completedActions = actions.filter((contract) => contract.status === 'completed');
  const actionsWaitingReview = completedActions.filter((contract) => !hasText(contract.outcomeReview)).length;
  const dailyReviewsCompleted = data.dailyReviews.filter(
    (review) => review.status === 'completed' && isOnOrAfter(review.updatedAt, windowStart)
  ).length;
  const quizAttempts = data.quizAttempts.filter((attempt) => isOnOrAfter(attempt.completedAt, windowStart)).length;

  return {
    windowLabel: '7 วันล่าสุด',
    actionsCreated: actions.length,
    actionsCompleted: completedActions.length,
    actionsWaitingReview,
    dailyReviewsCompleted,
    quizAttempts,
    learningMinutes: data.curriculumProgress.totalLearningMinutes,
    strongestSignal: getStrongestSignal(completedActions.length, dailyReviewsCompleted, quizAttempts),
    nextReviewFocus:
      actionsWaitingReview > 0
        ? 'ทบทวน action ที่ทำเสร็จแล้วว่า outcome เกิดจาก process ดีหรือโชค'
        : 'สร้าง action ขนาดเล็กใหม่หนึ่งเรื่อง แล้วกำหนดหลักฐานว่าเสร็จให้ชัด'
  };
}

function addSignal(
  condition: boolean,
  completedText: string,
  missingText: string,
  completedSignals: string[],
  missingSignals: string[]
): void {
  if (condition) {
    completedSignals.push(completedText);
  } else {
    missingSignals.push(missingText);
  }
}

function getScoreLevel(score: number, reviewedCount: number): AppliedDecisionScorecard['level'] {
  if (score === 0) {
    return 'ยังไม่เริ่ม';
  }
  if (score < 35) {
    return 'เริ่มเรียน';
  }
  if (score < 70) {
    return 'เริ่มนำไปใช้';
  }
  if (reviewedCount === 0) {
    return 'ใช้จริงแล้ว';
  }
  return 'ปรับปรุงจากผลจริง';
}

function getStrongestSignal(actionsCompleted: number, dailyReviewsCompleted: number, quizAttempts: number): string {
  if (actionsCompleted > 0) {
    return 'สัปดาห์นี้มี action ที่ทำเสร็จแล้ว';
  }
  if (dailyReviewsCompleted > 0) {
    return 'สัปดาห์นี้มีการทบทวนหลังเรียน';
  }
  if (quizAttempts > 0) {
    return 'สัปดาห์นี้เริ่มวัด weak area แล้ว';
  }
  return 'ยังไม่มีสัญญาณการนำไปใช้จริงในสัปดาห์นี้';
}

function isRealActionContract(contract: ActionContract): boolean {
  return (
    contract.status !== 'skipped' &&
    hasText(contract.what) &&
    hasText(contract.when) &&
    hasText(contract.minimumAcceptableAction) &&
    hasText(contract.evidenceOfCompletion)
  );
}

function hasText(value: string | null): boolean {
  return Boolean(value?.trim());
}

function isOnOrAfter(value: string, start: Date): boolean {
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time >= start.getTime();
}
