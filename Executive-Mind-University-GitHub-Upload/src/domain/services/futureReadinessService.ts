import type { FutureReadinessScore } from '../entities/appData';
import type { FutureReadinessEngine } from './engineContracts';

export class FutureReadinessService implements FutureReadinessEngine {
  calculateScore(inputs: Omit<FutureReadinessScore, 'overall'>): FutureReadinessScore {
    const values = Object.values(inputs);
    const boundedValues = values.map((value) => Math.max(0, Math.min(100, value)));
    const overall = Math.round(
      boundedValues.reduce((total, value) => total + value, 0) / boundedValues.length
    );

    return {
      aiLiteracy: this.bound(inputs.aiLiteracy),
      adaptability: this.bound(inputs.adaptability),
      decisionQuality: this.bound(inputs.decisionQuality),
      informationLiteracy: this.bound(inputs.informationLiteracy),
      systemsThinking: this.bound(inputs.systemsThinking),
      financialResilience: this.bound(inputs.financialResilience),
      healthCapacity: this.bound(inputs.healthCapacity),
      communication: this.bound(inputs.communication),
      learningConsistency: this.bound(inputs.learningConsistency),
      execution: this.bound(inputs.execution),
      overall
    };
  }

  private bound(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
