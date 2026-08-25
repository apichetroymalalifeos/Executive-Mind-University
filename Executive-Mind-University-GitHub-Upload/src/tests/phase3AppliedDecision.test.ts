import { describe, expect, it } from 'vitest';
import { lesson1 } from '../content/lessons/lesson1';
import { createDefaultEnvelope, createEmptyDecisionCanvas } from '../infrastructure/storage/defaultData';
import {
  createAppliedDecisionScorecard,
  createWeeklyAppliedReviewSummary
} from '../domain/services/appliedDecisionService';
import {
  getAppliedCompletionGate,
  saveDailyReview,
  saveExerciseDraft,
  saveQuizAttempt,
  upsertActionContract
} from '../domain/services/learningProgressService';

describe('phase 3 applied decision gate', () => {
  it('blocks lesson completion when no real action exists', () => {
    const gate = getAppliedCompletionGate(createDefaultEnvelope(), lesson1);

    expect(gate.canComplete).toBe(false);
    expect(gate.missingRequirements).toContain(
      'สร้าง Action Contract ที่มี action, เวลา, minimum action และหลักฐานว่าเสร็จ'
    );
  });

  it('allows completion only after the full learn apply review loop exists', () => {
    const fields = {
      ...createEmptyDecisionCanvas(),
      decisionTitle: 'Follow up hotel project',
      realProblem: 'The real buyer risk is unclear',
      facts: 'Customer asked for fire-rated material',
      assumptions: 'Budget may be flexible',
      nextActionWithin24Hours: 'Call the project owner'
    };
    const answers = {
      'q1-fact-assumption': 'ลูกค้าระบุว่าต้องใช้วัสดุกันไฟตามมาตรฐาน',
      'q2-first-principles': 'แยกปัญหาออกเป็นสิ่งที่ต้องเป็นจริง เช่น ลูกค้าต้องการลดความเสี่ยงด้านไฟและการดูแล',
      'q3-second-order': 'ลดราคาแล้วลูกค้าจำว่าต่อรองได้ง่ายในดีลถัดไป',
      'q4-scenario': 'ถามว่าเขาเทียบกับอะไรและกังวลเรื่องราคา คุณภาพ หรือความเสี่ยงใด',
      'q5-reflection': 'ใช้กับดีลโรงแรม'
    };

    const withExercise = saveExerciseDraft(createDefaultEnvelope(), lesson1.id, fields, true);
    const withQuiz = saveQuizAttempt(withExercise, lesson1.id, lesson1.quiz, answers);
    const withAction = upsertActionContract(withQuiz, lesson1.id, {
      what: 'Call the project owner and confirm the actual fire-rating risk',
      whyItMatters: 'The offer should match the real buying risk',
      when: 'Today 15:00',
      minimumAcceptableAction: 'Send one message asking for the decision criteria',
      evidenceOfCompletion: 'CRM note or chat screenshot',
      reviewDate: '2026-07-19',
      status: 'planned',
      outcomeReview: null
    });
    const actionId = withAction.reviews[0]?.id ?? null;
    const withReview = saveDailyReview(withAction, {
      lessonId: lesson1.id,
      actionContractId: actionId,
      whatDidILearn: 'Think from the real problem before proposing materials',
      whatSurprisedMe: 'The first customer request may not be the real risk',
      whereCanIApplyThis: 'Hotel project follow-up',
      whatDecisionBecameClearer: 'Ask for decision criteria before discounting',
      whatWillIDoWithin24Hours: 'Call the project owner',
      whatShouldIReviewLater: 'Whether the clarified criteria improved the deal',
      status: 'completed'
    });

    const gate = getAppliedCompletionGate(withReview, lesson1);

    expect(gate.canComplete).toBe(true);
    expect(gate.missingRequirements).toHaveLength(0);
    expect(gate.completedRequirements).toContain('มี Action Contract จริงภายใน 24 ชั่วโมง');
  });

  it('scores applied decision behavior from real learning signals', () => {
    const fields = {
      ...createEmptyDecisionCanvas(),
      decisionTitle: 'Call aviation prospect',
      realProblem: 'Need to identify the actual certification risk',
      facts: 'Prospect asked for material options',
      nextActionWithin24Hours: 'Ask for the required standard'
    };
    const withExercise = saveExerciseDraft(createDefaultEnvelope(), lesson1.id, fields, true);
    const withAction = upsertActionContract(withExercise, lesson1.id, {
      what: 'Ask the customer which certification blocks the project',
      whyItMatters: 'The next offer depends on the real constraint',
      when: 'Today 16:00',
      minimumAcceptableAction: 'Send one clear question',
      evidenceOfCompletion: 'CRM note',
      reviewDate: '2026-07-19',
      status: 'completed',
      completedAt: '2026-07-18T09:00:00.000Z',
      outcomeReview: 'Customer clarified the required standard'
    });

    const scorecard = createAppliedDecisionScorecard(withAction);

    expect(scorecard.score).toBeGreaterThan(40);
    expect(scorecard.completedSignals).toContain('มี Action Contract ที่ลงมือได้จริง');
    expect(scorecard.completedSignals).toContain('มีการทบทวนผลจริงหลังลงมือ');
    expect(scorecard.actionCompletionRate).toBe(100);
  });

  it('summarizes the weekly applied review window', () => {
    const now = new Date('2026-07-18T12:00:00.000Z');
    const withAction = upsertActionContract(createDefaultEnvelope('2026-07-18T08:00:00.000Z'), lesson1.id, {
      what: 'Follow up hotel buyer',
      whyItMatters: 'Clarify decision criteria',
      when: 'Today',
      minimumAcceptableAction: 'Send one message',
      evidenceOfCompletion: 'CRM note',
      reviewDate: '2026-07-19',
      status: 'planned',
      outcomeReview: null
    });

    const summary = createWeeklyAppliedReviewSummary(withAction, now);

    expect(summary.windowLabel).toBe('7 วันล่าสุด');
    expect(summary.actionsCreated).toBe(1);
    expect(summary.nextReviewFocus).toContain('สร้าง action');
  });
});
