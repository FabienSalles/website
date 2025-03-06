import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import axios from 'axios';
import getAccessToken from "@linkedin/api/access-token";
import cache from "@linkedin/api/cache";

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAccessToken', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id';
    process.env.LINKEDIN_CLIENT_SECRET = 'test-client-secret';
  });

  afterEach(() => {
    vi.clearAllMocks();
    cache.flushAll();
  });

  it('should get access token successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {access_token: 'test-access-token'}
    });

    const token = await getAccessToken();

    expect(token).toBe('test-access-token');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'test-client-id',
        client_secret: 'test-client-secret'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  });

  it('should throw error when request fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    await expect(getAccessToken()).rejects.toThrow('API Error');
  });

  it('should get access token from cache', async () => {
    const cachedToken = 'cached-access-token';
    vi.spyOn(cache, 'get').mockReturnValueOnce(cachedToken);

    const token = await getAccessToken();

    expect(token).toBe(cachedToken);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});