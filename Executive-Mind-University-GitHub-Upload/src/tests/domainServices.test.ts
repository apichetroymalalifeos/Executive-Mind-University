import { describe, expect, it } from 'vitest';
import { ApplicationService } from '../domain/services/applicationService';
import { DecisionIntelligenceService } from '../domain/services/decisionIntelligenceService';
import { FutureReadinessService } from '../domain/services/futureReadinessService';
import { KnowledgeUpdateService } from '../domain/services/knowledgeUpdateService';
import { ReflectionFeedbackService } from '../domain/services/reflectionFeedbackService';
import { calculateLessonCompletionRate } from '../domain/services/progressService';
import { createDefaultEnvelope } from '../infrastructure/storage/defaultData';
import { createDecision } from './testFactories';
import type { KnowledgeSource, LessonRevision } from '../domain/entities/appData';
import { createId } from '../utils/createId';

describe('domain services', () => {
  it('calculates decision calibration from reviewed decisions without judging by outcome alone', () => {
    const decisions = [
      createDecision({
        id: 'good-process-bad-outcome',
        actualOutcome: 'Lost deal',
        processWasGood: true,
        outcomeWasGood: false,
        confidenceScore: 60
      }),
      createDecision({
        id: 'bad-process-good-outcome',
        actualOutcome: 'Won deal',
        processWasGood: false,
        outcomeWasGood: true,
        confidenceScore: 80
      })
    ];

    const calibration = new DecisionIntelligenceService().calculateCalibration(decisions);

    expect(calibration.reviewedCount).toBe(2);
    expect(calibration.processGoodRate).toBe(0.5);
    expect(calibration.outcomeGoodRate).toBe(0.5);
    expect(calibration.averageConfidence).toBe(70);
  });

  it('detects weak areas from reviewed decisions', () => {
    const data = createDefaultEnvelope();
    data.decisions = [
      createDecision({
        facts: [],
        assumptions: [],
        actualOutcome: 'Overconfident miss',
        processWasGood: false,
        outcomeWasGood: false,
        confidenceScore: 90
      })
    ];

    const weakAreas = new ReflectionFeedbackService().detectWeakAreas(data);

    expect(weakAreas['Decision quality']).toBe(1);
    expect(weakAreas['Fact vs Assumption']).toBe(1);
    expect(weakAreas.Calibration).toBe(1);
  });

  it('blocks Tier D sources as primary evidence and requires approved revisions', () => {
    const source: KnowledgeSource = {
      id: 'source-1',
      title: 'Unsupported claim',
      author: 'Unknown',
      organization: 'Unknown',
      sourceType: 'social_post',
      publicationDate: '2026-07-17',
      url: 'https://example.test',
      accessedDate: '2026-07-17',
      credibilityTier: 'D',
      primaryOrSecondary: 'secondary',
      peerReviewed: false,
      officialSource: false,
      topicTags: ['AI'],
      notes: 'No supporting evidence',
      status: 'approved'
    };
    const revision: LessonRevision = {
      lessonId: 'lesson-001-art-of-thinking',
      revisionId: 'revision-1',
      previousVersion: 1,
      newVersion: 2,
      changeSummary: 'Add unsupported claim',
      reason: 'Trend mention',
      sourceIds: ['source-1'],
      reviewedBy: 'human',
      reviewStatus: 'approved',
      createdAt: '2026-07-17T00:00:00.000Z',
      approvedAt: '2026-07-17T00:00:00.000Z'
    };

    const service = new KnowledgeUpdateService();

    expect(service.canUseAsPrimaryEvidence(source)).toBe(false);
    expect(service.canPublishRevision(revision, [source])).toBe(false);
  });

  it('bounds future readiness scores and calculates overall', () => {
    const score = new FutureReadinessService().calculateScore({
      aiLiteracy: 120,
      adaptability: 50,
      decisionQuality: 50,
      informationLiteracy: 50,
      systemsThinking: 50,
      financialResilience: 50,
      healthCapacity: 50,
      communication: 50,
      learningConsistency: 50,
      execution: -10
    });

    expect(score.aiLiteracy).toBe(100);
    expect(score.execution).toBe(0);
    expect(score.overall).toBe(50);
  });

  it('calculates lesson completion rate', () => {
    const data = createDefaultEnvelope();
    data.curriculumProgress.completedLessonIds = ['lesson-001-art-of-thinking'];

    expect(calculateLessonCompletionRate(data.curriculumProgress, 2)).toBe(0.5);
  });

  it('creates ids when randomUUID is unavailable', () => {
    const id = createId('test', {});

    expect(id).toMatch(/^test-/);
  });

  it('creates action contracts without requiring crypto.randomUUID', () => {
    const contract = new ApplicationService().createActionContract({
      lessonId: 'lesson-001-art-of-thinking',
      what: 'Apply one idea',
      whyItMatters: 'Turns learning into behavior',
      when: 'Today',
      minimumAcceptableAction: 'Write one sentence',
      evidenceOfCompletion: 'Saved note',
      reviewDate: '2026-07-18'
    });

    expect(contract.id).toBeTruthy();
    expect(contract.completedAt).toBeNull();
  });
});
