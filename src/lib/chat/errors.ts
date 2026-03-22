import { FunctionsHttpError } from '@supabase/supabase-js';

const extractMessageFromPayload = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;
  const candidates = [record.error, record.response, record.message];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }

  return null;
};

export const getFunctionErrorMessage = async (error: unknown, fallback: string): Promise<string> => {
  if (error instanceof FunctionsHttpError) {
    try {
      const payload = await error.context.clone().json();
      const message = extractMessageFromPayload(payload);
      if (message) return message;
    } catch {
      try {
        const text = await error.context.text();
        if (text.trim()) return text;
      } catch {
        // Ignore parse failures and fall through to fallback.
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
