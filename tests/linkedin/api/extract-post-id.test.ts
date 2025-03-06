import {describe, expect, it} from "vitest";
import extractPostId from "@linkedin/api/extract-post-id";

describe('extractPostId', () => {
  it('should extract ID from feed URL format', () => {
    const url = 'https://www.linkedin.com/feed/update/urn:li:activity:1234567890/';
    expect(extractPostId(url)).toBe('1234567890');
  });

  it('should extract ID from posts URL format', () => {
    const url = 'https://www.linkedin.com/posts/username_hashtags-activity-1234567890';
    expect(extractPostId(url)).toBe('1234567890');
  });

  it('should extract ID from query parameter', () => {
    const url = 'https://www.linkedin.com/some/path?activityId=1234567890';
    expect(extractPostId(url)).toBe('1234567890');
  });

  it('should return null for unrecognized formats', () => {
    const url = 'https://www.linkedin.com/some/other/path';
    expect(extractPostId(url)).toBeNull();
  });

  it('should handle invalid URLs', () => {
    expect(extractPostId('not-a-url')).toBeNull();
  });
});