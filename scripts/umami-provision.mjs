#!/usr/bin/env node

/**
 * Provisions the fabiensalles.com website on the self-hosted Umami instance.
 *
 * Usage :
 *   UMAMI_API_KEY=xxx node scripts/umami-provision.mjs
 *
 * Safe to run more than once: it looks up the website by domain first and
 * reuses its id instead of creating a duplicate.
 */

const UMAMI_API_URL = process.env.UMAMI_API_URL || 'https://umami.salles.dev';
const DOMAIN = 'fabiensalles.com';
const NAME = 'Fabien Salles';

export async function provisionWebsite({ hostUrl, apiKey, domain = DOMAIN, name = NAME, fetchImpl = fetch }) {
  if (!hostUrl) throw new Error('UMAMI_API_URL is required');
  if (!apiKey) throw new Error('UMAMI_API_KEY is required');

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const listResponse = await fetchImpl(`${hostUrl}/api/websites?query=${encodeURIComponent(domain)}`, { headers });
  if (!listResponse.ok) {
    throw new Error(`Failed to list Umami websites: ${listResponse.status}`);
  }
  const { data: websites } = await listResponse.json();
  const existing = websites.find((website) => website.domain === domain);

  if (existing) {
    return { id: existing.id, created: false };
  }

  const createResponse = await fetchImpl(`${hostUrl}/api/websites`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, domain }),
  });
  if (!createResponse.ok) {
    throw new Error(`Failed to create Umami website: ${createResponse.status}`);
  }
  const created = await createResponse.json();
  return { id: created.id, created: true };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  try {
    const { id, created } = await provisionWebsite({ hostUrl: UMAMI_API_URL, apiKey: process.env.UMAMI_API_KEY });
    console.log(created ? `Created Umami website ${DOMAIN} → ${id}` : `Umami website ${DOMAIN} already exists → ${id}`);
    console.log(`Set UMAMI_WEBSITE_ID=${id} in .env`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
