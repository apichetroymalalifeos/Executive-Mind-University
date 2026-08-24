import { describe, expect, it } from 'vitest';
import { lesson1 } from '../content/lessons/lesson1';
import { createDefaultEnvelope, createEmptyDecisionCanvas } from '../infrastructure/storage/defaultData';
import {
  calculateNextStreak,
  calculateSectionProgress,
  markLessonComplete,
  markSectionComplete,
  saveExerciseDraft,
  saveQuizAttempt,
  scoreQuiz,
  setCurrentSection,
  startLesson,
  upsertActionContract
} from '../domain/services/learningProgressService';

const fixedDate = new Date('2026-07-18T08:00:00+07:00');

describe('phase 2 learning loop services', () => {
  it('starts, changes section, and resumes lesson position', () => {
    const started = startLesson(createDefaultEnvelope('2026-07-18T00:00:00.000Z'), lesson1, fixedDate);
    const moved = setCurrentSection(started, lesson1.id, 'choosing-real-problem');

    expect(moved.curriculumProgress.currentLessonId).toBe(lesson1.id);
    expect(moved.curriculumProgress.currentSectionId).toBe('choosing-real-problem');
    expect(moved.lessonProgress[0]?.currentSectionId).toBe('choosing-real-problem');
  });

  it('calculates section progress and marks section complete', () => {
    const started = startLesson(createDefaultEnvelope(), lesson1);
    const updated = markSectionComplete(started, lesson1.id, lesson1.sections[0]?.id ?? '');

    expect(calculateSectionProgress(updated.lessonProgress[0]?.completedSectionIds ?? [], lesson1.sections.length)).toBeGreaterThan(0);
  });

  it('keeps same-day streak stable and increments next day', () => {
    expect(calculateNextStreak(null, '2026-07-18', 0)).toBe(1);
    expect(calculateNextStreak('2026-07-18', '2026-07-18', 1)).toBe(1);
    expect(calculateNextStreak('2026-07-18', '2026-07-19', 1)).toBe(2);
    expect(calculateNextStreak('2026-07-18', '2026-07-21', 2)).toBe(1);
  });

  it('scores quiz and records weak areas without overwriting attempts', () => {
    const answers = {
      'q1-fact-assumption': 'ลูกค้าระบุว่าต้องใช้วัสดุกันไฟตามมาตรฐาน',
      'q2-first-principles': 'เริ่มจาก trend ใหม่',
      'q3-second-order': 'ลดราคาแล้วลูกค้าจำว่าต่อรองได้ง่ายในดีลถัดไป',
      'q4-scenario': 'ถามว่าเขาเทียบกับอะไรและกังวลเรื่องราคา คุณภาพ หรือความเสี่ยงใด',
      'q5-reflection': 'ใช้กับดีลโรงแรม'
    };
    const result = scoreQuiz(lesson1.quiz, answers);
    const first = saveQuizAttempt(createDefaultEnvelope(), lesson1.id, lesson1.quiz, answers);
    const second = saveQuizAttempt(first, lesson1.id, lesson1.quiz, answers);

    expect(result.score).toBe(75);
    expect(first.curriculumProgress.weakAreas['First Principles']).toBe(1);
    expect(second.quizAttempts).toHaveLength(2);
  });

  it('saves exercise draft and complete status', () => {
    const fields = {
      ...createEmptyDecisionCanvas(),
      decisionTitle: 'Choose offer',
      realProblem: 'Customer risk',
      facts: 'Need fire standard',
      assumptions: 'Budget flexible',
      nextActionWithin24Hours: 'Call stakeholder'
    };
    const updated = saveExerciseDraft(createDefaultEnvelope(), lesson1.id, fields, true);

    expect(updated.exercises[0]?.status).toBe('completed');
    expect(updated.curriculumProgress.exerciseStatus[lesson1.id]).toBe('completed');
  });

  it('creates action contract and completes lesson', () => {
    const withAction = upsertActionContract(createDefaultEnvelope(), lesson1.id, {
      what: 'Call customer',
      whyItMatters: 'Clarify real risk',
      when: 'Today',
      minimumAcceptableAction: 'Send one message',
      evidenceOfCompletion: 'CRM note',
      reviewDate: '2026-07-19',
      status: 'planned',
      outcomeReview: null
    });
    const completed = markLessonComplete(startLesson(withAction, lesson1, fixedDate), lesson1, 25, fixedDate);

    expect(withAction.reviews[0]?.status).toBe('planned');
    expect(completed.curriculumProgress.completedLessonIds).toContain(lesson1.id);
    expect(completed.curriculumProgress.totalLearningMinutes).toBe(25);
  });
});
