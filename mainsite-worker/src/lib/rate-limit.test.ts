import { describe, expect, it } from 'vitest';
import { DEFAULT_RATE_LIMIT_TOGGLE, normalizeRateLimitToggleConfig } from './rate-limit.ts';

describe('normalizeRateLimitToggleConfig', () => {
  it('ignora limites numericos legados e preserva apenas toggles', () => {
    const result = normalizeRateLimitToggleConfig({
      chatbot: { enabled: true, maxRequests: 500, windowMinutes: 60 },
      email: { enabled: true, maxRequests: 3, windowMinutes: 15 },
      comments: { enabled: false, maxRequests: 3, windowMinutes: 60 },
      routes: { 'chat-public-global': { maxRequests: 500, windowMinutes: 60 } },
    });

    expect(result).toEqual({
      chatbot: { enabled: true },
      email: { enabled: true },
      comments: { enabled: false },
    });
    expect(result).not.toHaveProperty('routes');
  });

  it('preserva enabled legado na raiz para o bucket chatbot', () => {
    expect(normalizeRateLimitToggleConfig({ enabled: true })).toEqual({
      ...DEFAULT_RATE_LIMIT_TOGGLE,
      chatbot: { enabled: true },
    });
  });

  it('retorna defaults para payload invalido ou ausente', () => {
    expect(normalizeRateLimitToggleConfig(null)).toEqual(DEFAULT_RATE_LIMIT_TOGGLE);
    expect(normalizeRateLimitToggleConfig([])).toEqual(DEFAULT_RATE_LIMIT_TOGGLE);
  });
});
