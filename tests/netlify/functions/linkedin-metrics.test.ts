import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import getAccessToken from "@linkedin/api/access-token.ts";
import getMetrics from "@linkedin/api/get-metrics.ts";
import type {LinkedInMetrics} from "@linkedin";
import { handler } from 'netlify/functions/linkedin-metrics';

vi.mock('@linkedin/api/access-token.ts');
vi.mock('@linkedin/api/get-metrics.ts');

const mockAccessToken = getAccessToken as jest.MockedFunction<typeof getAccessToken>;
const mockGetMetrics = getMetrics as jest.MockedFunction<typeof getMetrics>;
const expectedMetrics: LinkedInMetrics = {
  likes: 10,
  comments: 5,
  shares: 2,
  hasMetrics: true
};

describe('LinkedIn Metrics Function', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    const event = { httpMethod: 'POST' } as any;
    const response = await handler(event);

    expect(response.statusCode).toBe(405);
    expect(JSON.parse(<string>response.body)).toEqual({ error: 'Method not allowed' });
  });

  it('should return 400 when URL is missing', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: {}
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(<string>response.body)).toEqual({ error: 'LinkedIn post URL is required' });
  });

  it('should return 400 when post ID cannot be extracted', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: { url: 'https://linkedin.com/invalid/url' }
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(<string>response.body)).toHaveProperty('error');
  });

  it('should return metrics ', async () => {
    mockAccessToken.mockResolvedValue('test-access-token');
    mockGetMetrics.mockResolvedValue(expectedMetrics);

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { url: 'https://linkedin.com/posts/username_hashtags-activity-1234567890' }
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(<string>response.body)).toEqual(expectedMetrics);
  });

  it('should return 500 when an error occurs on get access token', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: { url: 'https://linkedin.com/posts/username_hashtags-activity-1234567890' }
    } as any;

    mockAccessToken.mockRejectedValue(new Error('Access token error'));

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(<string>response.body)).toHaveProperty('error');
  });

  it('should return 500 when an error occurs on get metrics', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: { url: 'https://linkedin.com/posts/username_hashtags-activity-1234567890' }
    } as any;
    mockAccessToken.mockResolvedValue('test-access-token');
    mockGetMetrics.mockRejectedValue(new Error('Metrics error'));

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(<string>response.body)).toHaveProperty('error');
  });
});