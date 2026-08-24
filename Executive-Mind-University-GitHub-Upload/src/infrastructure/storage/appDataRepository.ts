import { STORAGE_ROOT_KEY, type AppDataEnvelope } from '../../domain/entities/appData';
import { createDefaultEnvelope } from './defaultData';
import { migrateToCurrentSchema } from './migrations';
import type { StorageDriver } from './storageDriver';

export interface RepositoryLoadResult {
  data: AppDataEnvelope;
  recovered: boolean;
  errors: string[];
}

export interface AppDataRepository {
  load(): RepositoryLoadResult;
  save(data: AppDataEnvelope): void;
  clear(): void;
}

export class LocalAppDataRepository implements AppDataRepository {
  constructor(
    private readonly driver: StorageDriver,
    private readonly key = STORAGE_ROOT_KEY
  ) {}

  load(): RepositoryLoadResult {
    const raw = safeRead(this.driver, this.key);
    if (raw === null) {
      return { data: createDefaultEnvelope(), recovered: false, errors: [] };
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      const migration = migrateToCurrentSchema(parsed);
      if (!migration.ok || migration.data === null) {
        return {
          data: createDefaultEnvelope(),
          recovered: true,
          errors: migration.errors
        };
      }
      return { data: migration.data, recovered: false, errors: [] };
    } catch (error) {
      return {
        data: createDefaultEnvelope(),
        recovered: true,
        errors: [error instanceof Error ? error.message : 'Unknown storage parse error']
      };
    }
  }

  save(data: AppDataEnvelope): void {
    const payload = JSON.stringify({ ...data, updatedAt: new Date().toISOString() });
    safeWrite(this.driver, this.key, payload);
  }

  clear(): void {
    this.driver.remove(this.key);
  }
}

function safeRead(driver: StorageDriver, key: string): string | null {
  try {
    return driver.read(key);
  } catch (error) {
    console.warn('Storage read failed', error);
    return null;
  }
}

function safeWrite(driver: StorageDriver, key: string, value: string): void {
  try {
    driver.write(key, value);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Storage write failed');
  }
}
