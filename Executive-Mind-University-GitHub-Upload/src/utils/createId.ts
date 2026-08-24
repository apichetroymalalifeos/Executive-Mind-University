interface CryptoWithOptionalRandomUuid {
  randomUUID?: () => string;
  getRandomValues?: (array: Uint32Array) => Uint32Array;
}

export function createId(prefix = 'id', cryptoSource: CryptoWithOptionalRandomUuid | undefined = globalThis.crypto): string {
  if (typeof cryptoSource?.randomUUID === 'function') {
    return cryptoSource.randomUUID();
  }

  const timePart = Date.now().toString(36);
  const randomPart = createRandomPart(cryptoSource);

  return `${prefix}-${timePart}-${randomPart}`;
}

function createRandomPart(cryptoSource: CryptoWithOptionalRandomUuid | undefined): string {
  if (typeof cryptoSource?.getRandomValues === 'function') {
    const values = cryptoSource.getRandomValues(new Uint32Array(2));
    return Array.from(values, (value) => value.toString(36).padStart(6, '0')).join('');
  }

  return Math.random().toString(36).slice(2, 12).padEnd(10, '0');
}
