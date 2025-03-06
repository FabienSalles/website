import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LinkedInService, type LinkedInMetrics } from '@linkedin';

describe('LinkedInService', () => {
  let service: LinkedInService;

  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    service = new LinkedInService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getMetrics', () => {
    it('should fetch metrics successfully', async () => {
      const mockMetrics: LinkedInMetrics = {
        likes: 10,
        comments: 5,
        shares: 2,
        hasMetrics: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics
      });

      const result = await service.getMetrics('https://linkedin.com/posts/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/linkedin-metrics?url=https%3A%2F%2Flinkedin.com%2Fposts%2Ftest'
      );
      expect(result).toEqual(mockMetrics);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await service.getMetrics('https://linkedin.com/posts/test');

      expect(result).toEqual({
        likes: 0,
        comments: 0,
        shares: 0,
        hasMetrics: false,
        error: 'API error: 500'
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getMetrics('https://linkedin.com/posts/test');

      expect(result).toEqual({
        likes: 0,
        comments: 0,
        shares: 0,
        hasMetrics: false,
        error: 'Network error'
      });
    });

    it('should use custom base URL if provided', async () => {
      const customService = new LinkedInService('/api');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likes: 1, comments: 0, shares: 0, hasMetrics: true })
      });

      await customService.getMetrics('https://linkedin.com/posts/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/linkedin-metrics?url=https%3A%2F%2Flinkedin.com%2Fposts%2Ftest'
      );
    });
  });
});