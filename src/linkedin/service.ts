import type { LinkedInMetrics } from './types';

export class LinkedInService {
  private baseUrl: string;

  constructor(baseUrl: string = '/.netlify/functions') {
    this.baseUrl = baseUrl;
  }

  async getMetrics(postUrl: string): Promise<LinkedInMetrics> {
    try {
      const apiUrl = `${this.baseUrl}/linkedin-metrics?url=${encodeURIComponent(postUrl)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
        hasMetrics: data.hasMetrics || false
      };
    } catch (error) {
      console.error('Error fetching LinkedIn metrics:', error);
      return {
        likes: 0,
        comments: 0,
        shares: 0,
        hasMetrics: false,
        error: (error as Error).message
      };
    }
  }
}

export const linkedInService = new LinkedInService();