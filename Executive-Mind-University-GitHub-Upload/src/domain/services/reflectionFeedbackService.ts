import type { AppDataEnvelope } from '../entities/appData';
import type { ReflectionFeedbackEngine } from './engineContracts';

export class ReflectionFeedbackService implements ReflectionFeedbackEngine {
  detectWeakAreas(data: AppDataEnvelope): Record<string, number> {
    const weakAreas: Record<string, number> = { ...data.curriculumProgress.weakAreas };

    for (const decision of data.decisions) {
      if (decision.actualOutcome === null) {
        continue;
      }
      if (decision.processWasGood === false) {
        weakAreas['Decision quality'] = (weakAreas['Decision quality'] ?? 0) + 1;
      }
      if (decision.facts.length === 0 || decision.assumptions.length === 0) {
        weakAreas['Fact vs Assumption'] = (weakAreas['Fact vs Assumption'] ?? 0) + 1;
      }
      if (decision.confidenceScore > 80 && decision.outcomeWasGood === false) {
        weakAreas['Calibration'] = (weakAreas['Calibration'] ?? 0) + 1;
      }
    }

    return weakAreas;
  }
}
