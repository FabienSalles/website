/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly TRANSLATION_ENABLED: string;
  readonly TRAINING_ENABLED: string;
  readonly CV_ENABLED: string;
  readonly ABOUT_ENABLED: string;
  readonly CONTACT_ENABLED: string;
  readonly NEWSLETTER_ENABLED: string;
  readonly GITHUB_BLOG_CONTRIBUTION_BASE_URL: string;
  readonly LINKEDIN_CLIENT_ID: string;
  readonly LINKEDIN_CLIENT_SECRET: string;
  readonly LINKEDIN_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}