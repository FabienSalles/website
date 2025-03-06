const extractPostId: (url: string) => string | null = (url) => {
  try {
    const urlObj = new URL(url);

    // Format: https://www.linkedin.com/feed/update/urn:li:activity:1234567890/
    if (url.includes('urn:li:activity:')) {
      const match = url.match(/urn:li:activity:(\d+)/);
      return match ? match[1] : null;
    }

    // Format: https://www.linkedin.com/posts/username_hashtags-activity-1234567890
    if (url.includes('/posts/')) {
      const match = url.match(/activity-(\d+)/);
      return match ? match[1] : null;
    }

    // Extract from query parameters (e.g., ?activityId=1234567890)
    const activityId = urlObj.searchParams.get('activityId');

    if (activityId) {
      return activityId;
    }

    return null;
  } catch (error) {
    console.error('Error extracting post ID:', error);
    return null;
  }
}

export default extractPostId;