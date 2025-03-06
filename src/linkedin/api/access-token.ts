import axios from "axios";
import cache from "./cache.ts";

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const ACCESS_TOKEN_KEY = 'linkedin_access_token';

const getAccessToken: () => Promise<string> =  async () => {
  const cachedToken = cache.get<string>(ACCESS_TOKEN_KEY);

  if (cachedToken) {
    return cachedToken;
  }

  const response = await axios.post(
    LINKEDIN_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.LINKEDIN_CLIENT_ID || '',
      client_secret: process.env.LINKEDIN_CLIENT_SECRET || ''
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  const accessToken = response.data.access_token;

  const expiresIn = response.data.expires_in;

  cache.set(ACCESS_TOKEN_KEY, accessToken, expiresIn - 300); // 5 minutes buffer

  return accessToken;
}

export default getAccessToken;