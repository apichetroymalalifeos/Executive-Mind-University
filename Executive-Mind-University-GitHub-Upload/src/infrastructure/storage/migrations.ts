import {
  CURRENT_SCHEMA_VERSION,
  type ActionContract,
  type AppDataEnvelope,
  type CurriculumProgress,
  type ExerciseRecord,
  type MigrationBackup
} from '../../domain/entities/appData';
import { createDefaultEnvelope, createEmptyDecisionCanvas } from './defaultData';
import { isRecord, validateDataEnvelope, type ValidationResult } from './validation';
import { createId } from '../../utils/createId';

export interface MigrationResult {
  ok: boolean;
  data: AppDataEnvelope | null;
  backup: MigrationBackup;
  errors: string[];
}

export function migrateToCurrentSchema(input: unknown, now = new Date().toISOString()): MigrationResult {
  const backup = createMigrationBackup(input, now);

  if (!isRecord(input)) {
    return { ok: false, data: null, backup, errors: ['Cannot migrate non-object data'] };
  }

  const sourceVersion = typeof input.schemaVersion === 'number' ? input.schemaVersion : 0;
  if (sourceVersion > CURRENT_SCHEMA_VERSION) {
    return { ok: false, data: null, backup, errors: ['Cannot migrate future schema version'] };
  }
  if (sourceVersion === 1 && !isLikelyPhaseOneEnvelope(input)) {
    return { ok: false, data: null, backup, errors: ['Phase 1 import is missing required envelope fields'] };
  }

  const migrated = migrateByVersion(input, sourceVersion, now);
  const validation = validateDataEnvelope(migrated);

  return {
    ok: validation.ok,
    data: validation.data,
    backup,
    errors: validation.errors
  };
}

export function createMigrationBackup(input: unknown, now: string): MigrationBackup {
  return {
    schemaVersion: isRecord(input) && typeof input.schemaVersion === 'number' ? input.schemaVersion : null,
    createdAt: now,
    rawData: structuredClone(input)
  };
}

export function rollbackMigration(backup: MigrationBackup): ValidationResult<AppDataEnvelope> {
  return validateDataEnvelope(backup.rawData);
}

function migrateByVersion(input: Record<string, unknown>, sourceVersion: number, now: string): AppDataEnvelope {
  if (sourceVersion === CURRENT_SCHEMA_VERSION) {
    return input as unknown as AppDataEnvelope;
  }

  const v1 = sourceVersion === 0 ? migrateV0ToV1(input, now) : (input as unknown as Partial<AppDataEnvelope>);
  return migrateV1ToV2(v1, now);
}

function isLikelyPhaseOneEnvelope(input: Record<string, unknown>): boolean {
  return (
    isRecord(input.profile) &&
    isRecord(input.settings) &&
    isRecord(input.curriculumProgress) &&
    Array.isArray(input.decisions) &&
    Array.isArray(input.exercises) &&
    Array.isArray(input.reviews) &&
    Array.isArray(input.knowledgeSources) &&
    Array.isArray(input.lessonRevisions) &&
    Array.isArray(input.futureScenarios) &&
    Array.isArray(input.auditLog)
  );
}

function migrateV0ToV1(input: Record<string, unknown>, now: string): Partial<AppDataEnvelope> {
  const defaults = createDefaultEnvelope(now);
  return {
    ...defaults,
    schemaVersion: 1,
    profile: isRecord(input.profile) ? { ...defaults.profile, ...input.profile } : defaults.profile,
    updatedAt: now,
    auditLog: [
      ...defaults.auditLog,
      {
        id: createId('audit'),
        action: 'migration_v0_to_v1',
        entityType: 'app_data',
        entityId: 'executiveMindUniversity.v1',
        createdAt: now,
        summary: 'Migrated legacy or unversioned data into schema v1'
      }
    ]
  };
}

function migrateV1ToV2(input: Partial<AppDataEnvelope>, now: string): AppDataEnvelope {
  const defaults = createDefaultEnvelope(now);
  const progress = normalizeProgress(input.curriculumProgress, defaults.curriculumProgress);

  return {
    ...defaults,
    ...input,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: defaults.appVersion,
    updatedAt: now,
    profile: { ...defaults.profile, ...input.profile },
    settings: { ...defaults.settings, ...input.settings },
    curriculumProgress: progress,
    exercises: (input.exercises ?? []).map((exercise) => normalizeExercise(exercise, now)),
    reviews: (input.reviews ?? []).map((contract) => normalizeActionContract(contract, now)),
    dailyReviews: input.dailyReviews ?? [],
    lessonProgress: input.lessonProgress ?? [],
    quizAttempts: input.quizAttempts ?? [],
    auditLog: [
      ...(input.auditLog ?? []),
      {
        id: createId('audit'),
        action: 'migration_v1_to_v2',
        entityType: 'app_data',
        entityId: 'executiveMindUniversity.v1',
        createdAt: now,
        summary: 'Added Phase 2 learning loop fields while preserving existing data'
      }
    ]
  };
}

function normalizeProgress(
  input: Partial<CurriculumProgress> | undefined,
  defaults: CurriculumProgress
): CurriculumProgress {
  return {
    ...defaults,
    ...input,
    completedLessonIds: input?.completedLessonIds ?? [],
    quizScores: input?.quizScores ?? {},
    weakAreas: input?.weakAreas ?? {},
    learningStreakDays: input?.learningStreakDays ?? 0,
    lastLearningDate: input?.lastLearningDate ?? null,
    completedSectionIds: input?.completedSectionIds ?? {},
    lessonStartedAt: input?.lessonStartedAt ?? {},
    lessonCompletedAt: input?.lessonCompletedAt ?? {},
    latestQuizScore: input?.latestQuizScore ?? {},
    strongAreas: input?.strongAreas ?? {},
    totalLearningMinutes: input?.totalLearningMinutes ?? 0,
    exerciseStatus: input?.exerciseStatus ?? {},
    actionContractStatus: input?.actionContractStatus ?? {}
  };
}

function normalizeExercise(exercise: ExerciseRecord, now: string): ExerciseRecord {
  return {
    ...exercise,
    fields: exercise.fields ?? createEmptyDecisionCanvas(),
    status: exercise.status ?? 'draft',
    completedAt: exercise.completedAt ?? null,
    updatedAt: exercise.updatedAt ?? now
  };
}

function normalizeActionContract(contract: ActionContract, now: string): ActionContract {
  return {
    ...contract,
    status: contract.status ?? (contract.completedAt ? 'completed' : 'planned'),
    outcomeReview: contract.outcomeReview ?? null,
    updatedAt: contract.updatedAt ?? now
  };
}
