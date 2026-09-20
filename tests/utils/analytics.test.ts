import { describe, it, expect } from 'vitest';
import { shouldInjectUmami } from '@utils/analytics';

describe('shouldInjectUmami', () => {
  const validConfig = {
    context: 'production',
    websiteId: 'abc-123',
    src: '/stats.js',
    hostUrl: 'https://fabiensalles.com',
  };

  it('injects when the Netlify context is production and every value is configured', () => {
    expect(shouldInjectUmami(validConfig)).toBe(true);
  });

  it.each(['deploy-preview', 'branch-deploy', undefined])(
    'does not inject outside the production context (%s)',
    (context) => {
      expect(shouldInjectUmami({ ...validConfig, context })).toBe(false);
    }
  );

  it.each(['websiteId', 'src', 'hostUrl'] as const)(
    'does not inject when %s is missing even in production',
    (key) => {
      expect(shouldInjectUmami({ ...validConfig, [key]: undefined })).toBe(false);
    }
  );

  it('does not inject when a value is an empty string', () => {
    expect(shouldInjectUmami({ ...validConfig, websiteId: '' })).toBe(false);
  });
});
