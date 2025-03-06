import type {HandlerEvent, HandlerResponse} from '@netlify/functions';
import extractPostId from "@linkedin/api/extract-post-id.ts";
import getAccessToken from "@linkedin/api/access-token.ts";
import getMetrics from "@linkedin/api/get-metrics.ts";

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { url } = event.queryStringParameters || {};

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'LinkedIn post URL is required' }),
    };
  }

  try {
    const postId = extractPostId(url);

    if (!postId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Could not extract LinkedIn post ID from URL',
          url
        }),
      };
    }

    const accessToken = await getAccessToken();
    const metrics = await getMetrics(postId, accessToken);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600',
      },
      body: JSON.stringify(metrics),
    };
  } catch (error) {
    console.error('LinkedIn metrics function error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error fetching LinkedIn metrics',
        message: (error as Error).message
      }),
    };
  }
}