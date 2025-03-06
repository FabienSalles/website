import type {LinkedInMetrics, LinkedInSharesResponse, LinkedInSocialActionsResponse} from "@linkedin";
import axios, {AxiosError} from "axios";
import cache from "./cache.ts";

const getSocialActions = async (postId: string, accessToken: string) => {
  const response = await axios.get(
    `https://api.linkedin.com/v2/socialActions/urn:li:activity:${postId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    }
  );
  return response.data;
}

const getShares = async (postId: string, accessToken: string) => {
  const response =await axios.get(
    `https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:activity:${postId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    }
  );

  return response.data;
}

const getMetrics: (postId: string, accessToken: string) => Promise<LinkedInMetrics> = async (postId, accessToken) => {
  try {
    const cacheKey = `linkedin-metrics-${postId}`;
    const cachedMetrics: LinkedInMetrics | undefined = cache.get(cacheKey);

    if (cachedMetrics) {
      return cachedMetrics;
    }

    const socialActions: LinkedInSocialActionsResponse = await getSocialActions(postId, accessToken);
    let sharesCount = 0;
    try {
      const sharesResponse: LinkedInSharesResponse = await getShares(postId, accessToken);
      sharesCount = sharesResponse.paging?.total || 0;
    } catch (sharesError) {
      console.warn('Could not fetch shares count:', (sharesError as Error).message);
    }

    const metrics: LinkedInMetrics = {
      likes: socialActions.likesSummary?.totalLikes || 0,
      comments: socialActions.commentsSummary?.totalComments || 0,
      shares: sharesCount,
      hasMetrics: true
    };
    cache.set(cacheKey, metrics);

    return metrics;

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching LinkedIn metrics:',
      axiosError.response?.data || axiosError.message);
    return {
      likes: 0,
      comments: 0,
      shares: 0,
      hasMetrics: false,
      error: (error as Error).message
    };
  }
}

export default getMetrics;