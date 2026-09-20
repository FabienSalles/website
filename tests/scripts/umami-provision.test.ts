import { describe, it, expect, vi } from 'vitest';
import { provisionWebsite } from '../../scripts/umami-provision.mjs';

describe('provisionWebsite', () => {
  const hostUrl = 'https://umami.salles.dev';
  const apiKey = 'test-api-key';
  const domain = 'fabiensalles.com';

  it('creates the website when none exists yet for the domain', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'new-id' }) });

    const result = await provisionWebsite({ hostUrl, apiKey, domain, fetchImpl });

    expect(result).toEqual({ id: 'new-id', created: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[1][0]).toBe(`${hostUrl}/api/websites`);
    expect(fetchImpl.mock.calls[1][1]).toMatchObject({ method: 'POST' });
  });

  it('authenticates with an Authorization Bearer header, per the Umami API', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'new-id' }) });

    await provisionWebsite({ hostUrl, apiKey, domain, fetchImpl });

    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({
      Authorization: `Bearer ${apiKey}`,
    });
    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty('x-umami-api-key');
  });

  it('reuses the existing website instead of creating a duplicate', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: 'existing-id', domain: 'fabiensalles.com' }] }),
    });

    const result = await provisionWebsite({ hostUrl, apiKey, domain, fetchImpl });

    expect(result).toEqual({ id: 'existing-id', created: false });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('stays idempotent across repeated runs', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ id: 'existing-id', domain: 'fabiensalles.com' }] }),
    });

    const first = await provisionWebsite({ hostUrl, apiKey, domain, fetchImpl });
    const second = await provisionWebsite({ hostUrl, apiKey, domain, fetchImpl });

    expect(first).toEqual(second);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('throws when the API key is missing', async () => {
    await expect(
      provisionWebsite({ hostUrl, apiKey: '', domain, fetchImpl: vi.fn() })
    ).rejects.toThrow(/UMAMI_API_KEY/);
  });

  it('throws when listing websites fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 });

    await expect(provisionWebsite({ hostUrl, apiKey, domain, fetchImpl })).rejects.toThrow(/401/);
  });

  it('throws when creating the website fails', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
      .mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(provisionWebsite({ hostUrl, apiKey, domain, fetchImpl })).rejects.toThrow(/500/);
  });
});
