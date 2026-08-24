import type { FutureScenario } from '../../domain/entities/appData';

export const seedScenarios: FutureScenario[] = [
  {
    id: 'scenario-ai-agents-workflows',
    title: 'AI agents become everyday workflow partners',
    timeHorizon: 'near_future',
    domain: 'AI agents and automation',
    signals: ['More agentic software patterns', 'Rising pressure to automate repetitive work'],
    assumptions: ['Small teams will gain leverage when they can verify AI output'],
    uncertainties: ['Reliability, regulation, cost, and adoption speed'],
    opportunities: ['Better sales preparation', 'Faster customer follow-up', 'Internal process automation'],
    risks: ['Over-delegation without verification', 'Data privacy mistakes'],
    skillsNeeded: ['Human-AI collaboration', 'Verification', 'Workflow design'],
    decisionsToPrepare: ['Which tasks should be delegated, assisted, or kept human-only'],
    noRegretMoves: ['Document recurring workflows', 'Create verification checklists'],
    indicatorsToWatch: ['Agent reliability', 'Enterprise adoption', 'Security incidents'],
    confidenceLevel: 0.68,
    invalidationCriteria: 'AI agents fail to become reliable or cost-effective for routine business work'
  }
];
