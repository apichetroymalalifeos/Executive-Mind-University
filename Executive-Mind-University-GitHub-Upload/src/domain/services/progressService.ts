import type { CurriculumProgress } from '../entities/appData';

export function calculateLessonCompletionRate(progress: CurriculumProgress, totalLessons: number): number {
  if (totalLessons <= 0) {
    return 0;
  }
  return progress.completedLessonIds.length / totalLessons;
}

export function calculateLearningStreak(lastLearningDate: string | null, today: string): number {
  if (lastLearningDate === null) {
    return 0;
  }
  return lastLearningDate <= today ? 1 : 0;
}
