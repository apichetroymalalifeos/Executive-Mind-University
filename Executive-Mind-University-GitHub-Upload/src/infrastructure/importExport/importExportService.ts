import type { AppDataEnvelope } from '../../domain/entities/appData';
import { migrateToCurrentSchema } from '../storage/migrations';
import { createId } from '../../utils/createId';

const MAX_IMPORT_BYTES = 1024 * 1024;

export interface ImportPreview {
  ok: boolean;
  data: AppDataEnvelope | null;
  errors: string[];
  summary: {
    decisions: number;
    exercises: number;
    knowledgeSources: number;
    lessonRevisions: number;
    futureScenarios: number;
  } | null;
}

export function exportAppData(data: AppDataEnvelope): string {
  return JSON.stringify(data, null, 2);
}

export function previewImport(rawJson: string): ImportPreview {
  if (new Blob([rawJson]).size > MAX_IMPORT_BYTES) {
    return emptyPreview(['Import file is too large']);
  }

  try {
    const parsed: unknown = JSON.parse(rawJson);
    const migration = migrateToCurrentSchema(parsed);
    if (!migration.ok || migration.data === null) {
      return emptyPreview(migration.errors);
    }
    return {
      ok: true,
      data: migration.data,
      errors: [],
      summary: {
        decisions: migration.data.decisions.length,
        exercises: migration.data.exercises.length,
        knowledgeSources: migration.data.knowledgeSources.length,
        lessonRevisions: migration.data.lessonRevisions.length,
        futureScenarios: migration.data.futureScenarios.length
      }
    };
  } catch (error) {
    return emptyPreview([error instanceof Error ? error.message : 'Invalid JSON']);
  }
}

export function dryRunImport(current: AppDataEnvelope, rawJson: string): ImportPreview {
  const preview = previewImport(rawJson);
  if (!preview.ok || preview.data === null) {
    return preview;
  }
  return {
    ...preview,
    data: {
      ...preview.data,
      auditLog: [
        ...current.auditLog,
        {
          id: createId('audit'),
          action: 'import_dry_run',
          entityType: 'app_data',
          entityId: 'executiveMindUniversity.v1',
          createdAt: new Date().toISOString(),
          summary: 'Validated import without overwriting current data'
        }
      ]
    }
  };
}

function emptyPreview(errors: string[]): ImportPreview {
  return {
    ok: false,
    data: null,
    errors,
    summary: null
  };
}
