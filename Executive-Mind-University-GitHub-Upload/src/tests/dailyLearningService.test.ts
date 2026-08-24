import { describe, expect, it } from 'vitest';
import { createDefaultEnvelope } from '../infrastructure/storage/defaultData';
import { DailyLearningService } from '../domain/services/dailyLearningService';

describe('DailyLearningService', () => {
  it('recommends a due review before new learning', () => {
    const data = createDefaultEnvelope('2026-09-01T00:00:00.000Z');
    const recommendation = new DailyLearningService().recommend(data);

    expect(recommendation.reviewLessonId).toBe('lesson-001-art-of-thinking');
    expect(recommendation.reason).toContain('ทบทวน');
  });

  it('reduces duration when energy is low', () => {
    const data = createDefaultEnvelope('2026-07-18T00:00:00.000Z');
    data.profile.energyLevel = 'low';
    data.profile.availableMinutes = 25;

    const recommendation = new DailyLearningService().recommend(data);

    expect(recommendation.estimatedDuration).toBe(12);
  });
});
