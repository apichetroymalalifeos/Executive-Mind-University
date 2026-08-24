import type { DecisionCalibration, DecisionEntry } from '../entities/appData';
import type { DecisionIntelligenceEngine } from './engineContracts';

export class DecisionIntelligenceService implements DecisionIntelligenceEngine {
  calculateCalibration(decisions: DecisionEntry[]): DecisionCalibration {
    const reviewed = decisions.filter(
      (decision) => decision.actualOutcome !== null && decision.processWasGood !== null
    );

    if (reviewed.length === 0) {
      return {
        reviewedCount: 0,
        outcomeGoodRate: 0,
        processGoodRate: 0,
        averageConfidence: 0
      };
    }

    const outcomeGoodCount = reviewed.filter((decision) => decision.outcomeWasGood === true).length;
    const processGoodCount = reviewed.filter((decision) => decision.processWasGood === true).length;
    const confidenceTotal = reviewed.reduce((total, decision) => total + decision.confidenceScore, 0);

    return {
      reviewedCount: reviewed.length,
      outcomeGoodRate: outcomeGoodCount / reviewed.length,
      processGoodRate: processGoodCount / reviewed.length,
      averageConfidence: confidenceTotal / reviewed.length
    };
  }
}
