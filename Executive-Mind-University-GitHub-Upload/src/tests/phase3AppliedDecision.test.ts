import { describe, expect, it } from 'vitest';
import { lesson1 } from '../content/lessons/lesson1';
import { createDefaultEnvelope, createEmptyDecisionCanvas } from '../infrastructure/storage/defaultData';
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
});
