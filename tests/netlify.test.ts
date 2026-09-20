import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'smol-toml';

const netlifyConfig = () => parse(readFileSync('netlify.toml', 'utf-8')) as {
  redirects: Array<{ from: string; to: string; status: number; force?: boolean }>;
};

describe('netlify.toml Umami proxy', () => {
  it('proxies the Umami tracking script first-party, without redirecting the browser', () => {
    const config = netlifyConfig();
    const scriptProxy = config.redirects.find((redirect) => redirect.from === '/stats.js');

    expect(scriptProxy).toBeDefined();
    expect(scriptProxy?.to).toMatch(/^https:\/\/umami\.salles\.dev\//);
    expect(scriptProxy?.status).toBe(200);
    expect(scriptProxy?.force).toBe(true);
  });

  it('proxies the Umami collection endpoint first-party, without redirecting the browser', () => {
    const config = netlifyConfig();
    const collectProxy = config.redirects.find((redirect) => redirect.from === '/api/send');

    expect(collectProxy).toBeDefined();
    expect(collectProxy?.to).toMatch(/^https:\/\/umami\.salles\.dev\//);
    expect(collectProxy?.status).toBe(200);
    expect(collectProxy?.force).toBe(true);
  });

  it('keeps the pre-existing 301 redirects untouched', () => {
    const config = netlifyConfig();
    const legacyRedirect = config.redirects.find((redirect) => redirect.from === '/formations/tdd');

    expect(legacyRedirect).toMatchObject({ to: '/formations/phpunit/', status: 301, force: true });
  });
});
