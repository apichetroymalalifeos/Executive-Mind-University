import { CURRENT_SCHEMA_VERSION, type AppDataEnvelope } from '../../domain/entities/appData';

export interface ValidationResult<T> {
  ok: boolean;
  data: T | null;
  errors: string[];
}

export function validateDataEnvelope(value: unknown): ValidationResult<AppDataEnvelope> {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, data: null, errors: ['Payload must be a JSON object'] };
  }

  requireNumber(value, 'schemaVersion', errors);
  requireString(value, 'appVersion', errors);
  requireString(value, 'createdAt', errors);
  requireString(value, 'updatedAt', errors);
  requireObject(value, 'profile', errors);
  requireObject(value, 'settings', errors);
  requireObject(value, 'curriculumProgress', errors);
  requireArray(value, 'decisions', errors);
  requireArray(value, 'exercises', errors);
  requireArray(value, 'reviews', errors);
  requireArray(value, 'dailyReviews', errors);
  requireArray(value, 'lessonProgress', errors);
  requireArray(value, 'quizAttempts', errors);
  requireArray(value, 'knowledgeSources', errors);
  requireArray(value, 'lessonRevisions', errors);
  requireArray(value, 'futureScenarios', errors);
  requireArray(value, 'auditLog', errors);

  if (typeof value.schemaVersion === 'number' && value.schemaVersion > CURRENT_SCHEMA_VERSION) {
    errors.push('Schema version is newer than this app can read');
  }

  if (!isRecord(value.profile) || typeof value.profile.availableMinutes !== 'number') {
    errors.push('Profile availableMinutes is required');
  }

  if (!isRecord(value.curriculumProgress)) {
    errors.push('Curriculum progress is required');
  } else {
    requireArray(value.curriculumProgress, 'completedLessonIds', errors);
    requireObject(value.curriculumProgress, 'completedSectionIds', errors);
    requireObject(value.curriculumProgress, 'quizScores', errors);
    requireObject(value.curriculumProgress, 'weakAreas', errors);
    requireNumber(value.curriculumProgress, 'learningStreakDays', errors);
    requireNumber(value.curriculumProgress, 'totalLearningMinutes', errors);
  }

  return {
    ok: errors.length === 0,
    data: errors.length === 0 ? (value as unknown as AppDataEnvelope) : null,
    errors
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireString(value: Record<string, unknown>, key: string, errors: string[]): void {
  if (typeof value[key] !== 'string') {
    errors.push(`${key} must be a string`);
  }
}

function requireNumber(value: Record<string, unknown>, key: string, errors: string[]): void {
  if (typeof value[key] !== 'number') {
    errors.push(`${key} must be a number`);
  }
}

function requireArray(value: Record<string, unknown>, key: string, errors: string[]): void {
  if (!Array.isArray(value[key])) {
    errors.push(`${key} must be an array`);
  }
}

function requireObject(value: Record<string, unknown>, key: string, errors: string[]): void {
  if (!isRecord(value[key])) {
    errors.push(`${key} must be an object`);
  }
}
