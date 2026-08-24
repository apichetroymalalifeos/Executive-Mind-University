import type { AppDataEnvelope, LessonSummary } from '../entities/appData';
import type { DailyLearningEngine, DailyLearningRecommendation } from './engineContracts';
import { CurriculumService } from './curriculumService';

const LOW_ENERGY_MINUTES = 12;

export class DailyLearningService implements DailyLearningEngine {
  constructor(private readonly curriculum = new CurriculumService()) {}

  recommend(data: AppDataEnvelope): DailyLearningRecommendation {
    const availableLessons = this.curriculum.listAvailableLessons(data.curriculumProgress);
    const reviewLesson = this.findDueReview(availableLessons, data.updatedAt);
    const weakAreaLesson = this.findWeakAreaLesson(availableLessons, data.curriculumProgress.weakAreas);
    const lesson = reviewLesson ?? weakAreaLesson ?? availableLessons[0] ?? null;
    const duration = this.estimateDuration(lesson, data.profile.availableMinutes, data.profile.energyLevel);

    return {
      lesson,
      reason: this.buildReason(Boolean(reviewLesson), Boolean(weakAreaLesson), data.profile.energyLevel),
      estimatedDuration: duration,
      suggestedExercise: 'เขียนหนึ่งสถานการณ์จริงที่ต้องแยก Fact, Assumption, Opinion และ Unknown',
      suggestedApplication: 'เลือก decision หนึ่งเรื่องที่ต้องลงมือหรือทบทวนภายใน 24 ชั่วโมง',
      reviewLessonId: reviewLesson?.id ?? null
    };
  }

  private findDueReview(lessons: LessonSummary[], todayIso: string): LessonSummary | null {
    const today = todayIso.slice(0, 10);
    return lessons.find((lesson) => lesson.nextReviewDueAt <= today) ?? null;
  }

  private findWeakAreaLesson(
    lessons: LessonSummary[],
    weakAreas: AppDataEnvelope['curriculumProgress']['weakAreas']
  ): LessonSummary | null {
    const weakest = Object.entries(weakAreas).sort((a, b) => b[1] - a[1])[0];
    if (!weakest) {
      return null;
    }
    return lessons.find((lesson) => lesson.futureSkillTags.includes(weakest[0])) ?? null;
  }

  private estimateDuration(
    lesson: LessonSummary | null,
    availableMinutes: number,
    energyLevel: AppDataEnvelope['profile']['energyLevel']
  ): number {
    const base = lesson?.estimatedMinutes ?? availableMinutes;
    const energyCap = energyLevel === 'low' ? LOW_ENERGY_MINUTES : availableMinutes;
    return Math.max(5, Math.min(base, availableMinutes, energyCap));
  }

  private buildReason(hasReview: boolean, hasWeakArea: boolean, energyLevel: string): string {
    if (hasReview) {
      return 'เลือกบททบทวนก่อนลืม เพื่อรักษา feedback loop';
    }
    if (hasWeakArea) {
      return 'เลือกจาก weak area ที่พบใน progress และ reflection';
    }
    if (energyLevel === 'low') {
      return 'วันนี้ลดความยาวบทเรียนเพื่อให้ยังลงมือได้จริง';
    }
    return 'เริ่มจากบทฐานรากที่เปิดวงจรเรียนรู้และลงมือทำได้เร็วที่สุด';
  }
}
