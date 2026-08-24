import type {
  ActionContract,
  AppDataEnvelope,
  DecisionCalibration,
  DecisionEntry,
  Faculty,
  FutureReadinessScore,
  KnowledgeSource,
  LessonRevision,
  LessonSummary
} from '../entities/appData';

export interface CurriculumEngine {
  listFaculties(): Faculty[];
  listAvailableLessons(progress: AppDataEnvelope['curriculumProgress']): LessonSummary[];
}

export interface DailyLearningRecommendation {
  lesson: LessonSummary | null;
  reason: string;
  estimatedDuration: number;
  suggestedExercise: string;
  suggestedApplication: string;
  reviewLessonId: string | null;
}

export interface DailyLearningEngine {
  recommend(data: AppDataEnvelope): DailyLearningRecommendation;
}

export interface ApplicationEngine {
  createActionContract(
    input: Omit<ActionContract, 'id' | 'completedAt' | 'status' | 'outcomeReview' | 'updatedAt'> &
      Partial<Pick<ActionContract, 'status' | 'outcomeReview'>>
  ): ActionContract;
}

export interface DecisionIntelligenceEngine {
  calculateCalibration(decisions: DecisionEntry[]): DecisionCalibration;
}

export interface ReflectionFeedbackEngine {
  detectWeakAreas(data: AppDataEnvelope): Record<string, number>;
}

export interface KnowledgeUpdateEngine {
  canUseAsPrimaryEvidence(source: KnowledgeSource): boolean;
  canPublishRevision(revision: LessonRevision, sources: KnowledgeSource[]): boolean;
}

export interface FutureReadinessEngine {
  calculateScore(inputs: Omit<FutureReadinessScore, 'overall'>): FutureReadinessScore;
}
