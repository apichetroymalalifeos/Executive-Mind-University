import type { DecisionEntry } from '../domain/entities/appData';

export function createDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
  const now = '2026-07-17T00:00:00.000Z';

  return {
    id: 'decision-1',
    title: 'Choose supplier proposal',
    type: 'reversible',
    tags: ['sales'],
    lessonId: null,
    exerciseId: null,
    facts: ['Customer needs marine-grade material'],
    assumptions: ['Budget is flexible'],
    opinions: ['Option A feels premium'],
    unknowns: ['Final stakeholder preference'],
    options: ['Option A', 'Option B'],
    prediction: 'Customer will approve Option A',
    confidenceScore: 70,
    decision: 'Recommend Option A',
    nextActionWithin24Hours: 'Send sample board',
    reviewDate: '2026-07-24',
    actualOutcome: null,
    processWasGood: null,
    outcomeWasGood: null,
    luckInvolved: null,
    lessonLearned: null,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}
