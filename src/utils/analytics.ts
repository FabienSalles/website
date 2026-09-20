type UmamiConfig = {
  context?: string;
  websiteId?: string;
  src?: string;
  hostUrl?: string;
};

/**
 * Umami must only run in Netlify's production context: deploy previews and
 * branch deploys build with the same code but should not report real traffic.
 */
export function shouldInjectUmami(config: UmamiConfig): boolean {
  return (
    config.context === 'production' &&
    Boolean(config.websiteId) &&
    Boolean(config.src) &&
    Boolean(config.hostUrl)
  );
}
