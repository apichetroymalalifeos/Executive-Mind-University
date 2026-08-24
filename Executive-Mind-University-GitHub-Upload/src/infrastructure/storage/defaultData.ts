import { seedScenarios } from '../../content/scenarios/seedScenarios';
import { LESSON_1_ID } from '../../content/lessons/lesson1';
import {
  APP_VERSION,
  CURRENT_SCHEMA_VERSION,
  type AppDataEnvelope,
  type DecisionCanvasResponse
} from '../../domain/entities/appData';

export function createEmptyDecisionCanvas(): DecisionCanvasResponse {
  return {
    decisionTitle: '',
    realProblem: '',
    desiredOutcome: '',
    facts: '',
    assumptions: '',
    opinions: '',
    unknowns: '',
    constraints: '',
    options: '',
    reversibility: 'reversible',
    firstOrderEffects: '',
    secondOrderEffects: '',
    bestCase: '',
    baseCase: '',
    worstCase: '',
    probabilityEstimate: '',
    riskMitigation: '',
    decision: '',
    confidenceScore: '70',
    nextActionWithin24Hours: '',
    reviewDate: '',
    whatWouldChangeMyMind: ''
  };
}

export function createDefaultEnvelope(now = new Date().toISOString()): AppDataEnvelope {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    createdAt: now,
    updatedAt: now,
    profile: {
      displayName: 'Executive Learner',
      availableMinutes: 25,
      priorities: ['Sales', 'AI Business', 'Leadership'],
      energyLevel: 'medium',
      recoveryStatus: 'normal'
    },
    settings: {
      audioSpeed: 1,
      drivingWarningAcceptedAt: null,
      autosaveEnabled: true,
      language: 'th'
    },
    curriculumProgress: {
      completedLessonIds: [],
      currentFacultyId: 'first-principles-thinking',
      currentLessonId: LESSON_1_ID,
      currentSectionId: null,
      completedSectionIds: {},
      lessonStartedAt: {},
      lessonCompletedAt: {},
      quizScores: {},
      latestQuizScore: {},
      weakAreas: {},
      strongAreas: {},
      learningStreakDays: 0,
      lastLearningDate: null,
      totalLearningMinutes: 0,
      exerciseStatus: {},
      actionContractStatus: {}
    },
    decisions: [],
    exercises: [],
    reviews: [],
    dailyReviews: [],
    lessonProgress: [],
    quizAttempts: [],
    knowledgeSources: [],
    lessonRevisions: [],
    futureScenarios: seedScenarios,
    auditLog: [
      {
        id: 'audit-initial-seed',
        action: 'seed_default_data',
        entityType: 'app',
        entityId: 'executive-mind-university',
        createdAt: now,
        summary: 'Created default local-first data envelope'
      }
    ]
  };
}
