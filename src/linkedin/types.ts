export interface LinkedInMetrics {
  likes: number;
  comments: number;
  shares: number;
  hasMetrics: boolean;
  error?: string;
}

export interface LinkedInAccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
}

export interface LinkedInSocialActionsResponse {
  likesSummary?: {
    totalLikes: number;
  };
  commentsSummary?: {
    totalComments: number;
  };
}

export interface LinkedInSharesResponse {
  paging?: {
    total: number;
  };
}