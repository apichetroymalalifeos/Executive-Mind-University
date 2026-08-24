export const CURRENT_SCHEMA_VERSION = 2;
export const APP_VERSION = '0.2.0';
export const STORAGE_ROOT_KEY = 'executiveMindUniversity.v1';

export type FreshnessStatus =
  | 'current'
  | 'review_due'
  | 'potentially_outdated'
  | 'disputed'
  | 'archived';

export type SourceCredibilityTier = 'A' | 'B' | 'C' | 'D';
export type Difficulty = 'foundational' | 'intermediate' | 'advanced';
export type DecisionType =
  | 'reversible'
  | 'irreversible'
  | 'repeated'
  | 'one_time'
  | 'high_uncertainty'
  | 'high_consequence';
export type ExerciseStatus = 'not_started' | 'draft' | 'completed';
export type ActionContractStatus = 'planned' | 'completed' | 'postponed' | 'skipped';

export interface LearningProfile {
  displayName: string;
  availableMinutes: number;
  priorities: string[];
  energyLevel: 'low' | 'medium' | 'high';
  recoveryStatus: 'strained' | 'normal' | 'ready';
}

export interface UserSettings {
  audioSpeed: number;
  drivingWarningAcceptedAt: string | null;
  autosaveEnabled: boolean;
  language: 'th';
}

export interface Faculty {
  id: string;
  titleEnglish: string;
  titleThai: string;
  description: string;
}

export interface LessonSummary {
  id: string;
  version: number;
  titleEnglish: string;
  titleThai: string;
  facultyId: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  prerequisites: string[];
  learningObjectives: string[];
  futureSkillTags: string[];
  lastReviewedAt: string;
  nextReviewDueAt: string;
  freshnessStatus: FreshnessStatus;
}

export interface CurriculumProgress {
  completedLessonIds: string[];
  currentFacultyId: string | null;
  currentLessonId: string | null;
  currentSectionId: string | null;
  completedSectionIds: Record<string, string[]>;
  lessonStartedAt: Record<string, string>;
  lessonCompletedAt: Record<string, string>;
  quizScores: Record<string, number[]>;
  latestQuizScore: Record<string, number>;
  weakAreas: Record<string, number>;
  strongAreas: Record<string, number>;
  learningStreakDays: number;
  lastLearningDate: string | null;
  totalLearningMinutes: number;
  exerciseStatus: Record<string, ExerciseStatus>;
  actionContractStatus: Record<string, ActionContractStatus>;
}

export interface ActionContract {
  id: string;
  lessonId: string | null;
  what: string;
  whyItMatters: string;
  when: string;
  minimumAcceptableAction: string;
  evidenceOfCompletion: string;
  reviewDate: string;
  status: ActionContractStatus;
  completedAt: string | null;
  outcomeReview: string | null;
  updatedAt: string;
}

export interface DecisionCanvasResponse {
  decisionTitle: string;
  realProblem: string;
  desiredOutcome: string;
  facts: string;
  assumptions: string;
  opinions: string;
  unknowns: string;
  constraints: string;
  options: string;
  reversibility: string;
  firstOrderEffects: string;
  secondOrderEffects: string;
  bestCase: string;
  baseCase: string;
  worstCase: string;
  probabilityEstimate: string;
  riskMitigation: string;
  decision: string;
  confidenceScore: string;
  nextActionWithin24Hours: string;
  reviewDate: string;
  whatWouldChangeMyMind: string;
}

export interface ExerciseRecord {
  id: string;
  lessonId: string;
  prompt: string;
  response: string;
  fields: DecisionCanvasResponse;
  status: ExerciseStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgressRecord {
  lessonId: string;
  currentSectionId: string;
  completedSectionIds: string[];
  audioSectionId: string;
  lessonStartedAt: string;
  lessonCompletedAt: string | null;
  actualLearningMinutes: number;
  updatedAt: string;
}

export type QuizQuestionType = 'multiple_choice' | 'scenario' | 'reflection';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correctAnswerId: string | null;
  explanation: string;
  weakConcept: string;
}

export interface QuizAttempt {
  id: string;
  lessonId: string;
  answers: Record<string, string>;
  score: number;
  weakConcepts: string[];
  completedAt: string;
}

export interface DailyReviewEntry {
  id: string;
  lessonId: string;
  actionContractId: string | null;
  whatDidILearn: string;
  whatSurprisedMe: string;
  whereCanIApplyThis: string;
  whatDecisionBecameClearer: string;
  whatWillIDoWithin24Hours: string;
  whatShouldIReviewLater: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface DecisionEntry {
  id: string;
  title: string;
  type: DecisionType;
  tags: string[];
  lessonId: string | null;
  exerciseId: string | null;
  facts: string[];
  assumptions: string[];
  opinions: string[];
  unknowns: string[];
  options: string[];
  prediction: string;
  confidenceScore: number;
  decision: string;
  nextActionWithin24Hours: string;
  reviewDate: string;
  actualOutcome: string | null;
  processWasGood: boolean | null;
  outcomeWasGood: boolean | null;
  luckInvolved: 'low' | 'medium' | 'high' | null;
  lessonLearned: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionCalibration {
  reviewedCount: number;
  outcomeGoodRate: number;
  processGoodRate: number;
  averageConfidence: number;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  author: string;
  organization: string;
  sourceType: string;
  publicationDate: string;
  url: string;
  accessedDate: string;
  credibilityTier: SourceCredibilityTier;
  primaryOrSecondary: 'primary' | 'secondary';
  peerReviewed: boolean;
  officialSource: boolean;
  topicTags: string[];
  notes: string;
  status: 'draft' | 'approved' | 'rejected' | 'archived';
}

export interface LessonRevision {
  lessonId: string;
  revisionId: string;
  previousVersion: number;
  newVersion: number;
  changeSummary: string;
  reason: string;
  sourceIds: string[];
  reviewedBy: string | null;
  reviewStatus: 'draft' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
}

export interface FutureScenario {
  id: string;
  title: string;
  timeHorizon: 'now' | 'near_future' | 'medium_future' | 'long_future';
  domain: string;
  signals: string[];
  assumptions: string[];
  uncertainties: string[];
  opportunities: string[];
  risks: string[];
  skillsNeeded: string[];
  decisionsToPrepare: string[];
  noRegretMoves: string[];
  indicatorsToWatch: string[];
  confidenceLevel: number;
  invalidationCriteria: string;
}

export interface FutureReadinessScore {
  aiLiteracy: number;
  adaptability: number;
  decisionQuality: number;
  informationLiteracy: number;
  systemsThinking: number;
  financialResilience: number;
  healthCapacity: number;
  communication: number;
  learningConsistency: number;
  execution: number;
  overall: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  summary: string;
}

export interface AppDataEnvelope {
  schemaVersion: number;
  appVersion: string;
  createdAt: string;
  updatedAt: string;
  profile: LearningProfile;
  settings: UserSettings;
  curriculumProgress: CurriculumProgress;
  decisions: DecisionEntry[];
  exercises: ExerciseRecord[];
  reviews: ActionContract[];
  dailyReviews: DailyReviewEntry[];
  lessonProgress: LessonProgressRecord[];
  quizAttempts: QuizAttempt[];
  knowledgeSources: KnowledgeSource[];
  lessonRevisions: LessonRevision[];
  futureScenarios: FutureScenario[];
  auditLog: AuditLogEntry[];
}

export interface MigrationBackup {
  schemaVersion: number | null;
  createdAt: string;
  rawData: unknown;
}
