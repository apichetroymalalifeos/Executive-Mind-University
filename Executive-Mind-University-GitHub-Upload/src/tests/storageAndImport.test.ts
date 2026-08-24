import { describe, expect, it } from 'vitest';
import { createDefaultEnvelope } from '../infrastructure/storage/defaultData';
import { migrateToCurrentSchema, rollbackMigration } from '../infrastructure/storage/migrations';
import { LocalAppDataRepository } from '../infrastructure/storage/appDataRepository';
import { MemoryStorageDriver } from '../infrastructure/storage/storageDriver';
import { exportAppData, previewImport } from '../infrastructure/importExport/importExportService';
import { CURRENT_SCHEMA_VERSION, STORAGE_ROOT_KEY } from '../domain/entities/appData';

describe('storage, migration, and import/export', () => {
  it('validates exported app data during import preview', () => {
    const data = createDefaultEnvelope();
    const preview = previewImport(exportAppData(data));

    expect(preview.ok).toBe(true);
    expect(preview.summary?.futureScenarios).toBe(1);
  });

  it('rejects invalid import without returning destructive data', () => {
    const preview = previewImport('{"schemaVersion":1,"decisions":[]}');

    expect(preview.ok).toBe(false);
    expect(preview.data).toBeNull();
    expect(preview.errors.length).toBeGreaterThan(0);
  });

  it('migrates unversioned object data into the current schema and keeps a backup', () => {
    const migration = migrateToCurrentSchema({
      profile: {
        displayName: 'Migrated user',
        availableMinutes: 20
      }
    });

    expect(migration.ok).toBe(true);
    expect(migration.backup.schemaVersion).toBeNull();
    expect(migration.data?.profile.displayName).toBe('Migrated user');
  });

  it('rolls back only when backup is still valid current data', () => {
    const current = createDefaultEnvelope();
    const migration = migrateToCurrentSchema(current);
    const rollback = rollbackMigration(migration.backup);

    expect(rollback.ok).toBe(true);
  });

  it('recovers safely from corrupted storage without overwriting the broken value', () => {
    const driver = new MemoryStorageDriver();
    driver.write(STORAGE_ROOT_KEY, '{not valid json');
    const repository = new LocalAppDataRepository(driver);

    const load = repository.load();

    expect(load.recovered).toBe(true);
    expect(load.data.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(driver.read(STORAGE_ROOT_KEY)).toBe('{not valid json');
  });

  it('persists valid app data through the repository abstraction', () => {
    const driver = new MemoryStorageDriver();
    const repository = new LocalAppDataRepository(driver);
    const data = createDefaultEnvelope();

    repository.save(data);
    const loaded = repository.load();

    expect(loaded.recovered).toBe(false);
    expect(loaded.data.profile.displayName).toBe('Executive Learner');
  });
});
