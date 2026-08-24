export interface StorageDriver {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

export class BrowserLocalStorageDriver implements StorageDriver {
  read(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  write(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  remove(key: string): void {
    window.localStorage.removeItem(key);
  }
}

export class MemoryStorageDriver implements StorageDriver {
  private readonly records = new Map<string, string>();

  read(key: string): string | null {
    return this.records.get(key) ?? null;
  }

  write(key: string, value: string): void {
    this.records.set(key, value);
  }

  remove(key: string): void {
    this.records.delete(key);
  }
}
