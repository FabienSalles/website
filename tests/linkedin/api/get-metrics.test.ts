import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import axios from 'axios';
import getMetrics from "@linkedin/api/get-metrics";
import cache from "@linkedin/api/cache.ts";
import type {LinkedInMetrics} from "@linkedin";

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getMetrics', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(cache, 'set');
    cache.flushAll();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should get metrics successfully', async () => {
    const expectedMetrics: LinkedInMetrics = {
      likes: 10,
      comments: 5,
      shares: 2,
      hasMetrics: true
    };
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        likesSummary: { totalLikes: 10 },
        commentsSummary: { totalComments: 5 }
      }
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        paging: { total: 2 }
      }
    });

    const metrics = await getMetrics('1234567890', 'test-access-token');

    expect(metrics).toEqual(expectedMetrics);
    expect(cache.set).toHaveBeenCalledWith('linkedin-metrics-1234567890', expectedMetrics);
  });

  it('should handle missing data in response', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {}
    });
    mockedAxios.get.mockRejectedValueOnce(new Error('Shares API error'));

    const metrics = await getMetrics('1234567890', 'test-access-token');

    expect(metrics).toEqual({
      likes: 0,
      comments: 0,
      shares: 0,
      hasMetrics: true
    });
    expect(cache.set).toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));
    const metrics = await getMetrics('1234567890', 'test-access-token');

    expect(metrics).toEqual({
      likes: 0,
      comments: 0,
      shares: 0,
      hasMetrics: false,
      error: 'API error'
    });
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should get metrics from cache', async () => {
    const expectedMetrics: LinkedInMetrics = {
      likes: 10,
      comments: 5,
      shares: 2,
      hasMetrics: true
    }
    vi.spyOn(cache, 'get').mockReturnValueOnce(expectedMetrics);

    const actualMetrics = await getMetrics('1234567890', 'test-access-token');

    expect(actualMetrics).toEqual(expectedMetrics);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});