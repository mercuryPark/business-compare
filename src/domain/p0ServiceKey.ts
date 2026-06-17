export const P0_SERVICE_KEY_PLACEHOLDER = 'DATA_GO_KR_SERVICE_KEY_REQUIRED';

const invalidP0ServiceKeys = new Set([P0_SERVICE_KEY_PLACEHOLDER.toLowerCase(), 'samplekey']);

export function normalizeP0ServiceKey(serviceKey: string | undefined): string | undefined {
  const normalized = serviceKey?.trim();

  if (!normalized || invalidP0ServiceKeys.has(normalized.toLowerCase())) {
    return undefined;
  }

  return normalized;
}

export function isP0ServiceKeyConfigured(serviceKey: string | undefined): boolean {
  return Boolean(normalizeP0ServiceKey(serviceKey));
}
