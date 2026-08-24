import { describe, expect, it } from 'vitest';
import type { ActionContract } from '../domain/entities/appData';
import { createDailyHabitPlan, getSevenDayOperatingGuide } from '../domain/services/dailyHabitService';
import { createDefaultEnvelope } from '../infrastructure/storage/defaultData';

describe('daily habit service', () => {
  it('creates a small start plan for a fresh user', () => {
    const data = createDefaultEnvelope('2026-07-26T08:00:00+07:00');
    const plan = createDailyHabitPlan(data, new Date('2026-07-26T08:00:00+07:00'));

    expect(plan.reentryMode).toBe('start');
    expect(plan.nextRoute).toBe('/today');
    expect(plan.minimumAction).toContain('3 นาที');
  });

  it('prioritizes active action contracts over more learning', () => {
    const data = createDefaultEnvelope('2026-07-26T08:00:00+07:00');
    const action: ActionContract = {
      id: 'action-1',
      lessonId: 'lesson-001-art-of-thinking',
      what: 'โทรถาม stakeholder ว่ากังวลเรื่องราคา คุณภาพ หรือความเสี่ยง',
      whyItMatters: 'ต้องหา real problem ก่อนเสนอวัสดุ',
      when: 'วันนี้ 15:00',
      minimumAcceptableAction: 'ส่งข้อความถามคำถามเดียว',
      evidenceOfCompletion: 'มี note ใน CRM',
      reviewDate: '2026-07-27',
      status: 'planned',
      completedAt: null,
      outcomeReview: null,
      updatedAt: '2026-07-26T08:00:00+07:00'
    };
    data.reviews = [action];

    const plan = createDailyHabitPlan(data, new Date('2026-07-26T08:00:00+07:00'));

    expect(plan.reentryMode).toBe('review');
    expect(plan.nextRoute).toBe('/review');
    expect(plan.primaryPrompt).toBe(action.what);
  });

  it('recovers gently after missing more than one day', () => {
    const data = createDefaultEnvelope('2026-07-26T08:00:00+07:00');
    data.curriculumProgress.lastLearningDate = '2026-07-23';
    data.curriculumProgress.learningStreakDays = 4;

    const plan = createDailyHabitPlan(data, new Date('2026-07-26T08:00:00+07:00'));

    expect(plan.reentryMode).toBe('recover');
    expect(plan.minutes).toBe(3);
    expect(plan.headline).toContain('กลับมา');
  });

  it('provides a seven-day operating guide', () => {
    expect(getSevenDayOperatingGuide()).toHaveLength(7);
  });
});
