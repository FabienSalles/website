import {describe, it, expect} from 'vitest';
import {readFileSync} from 'node:fs';

const auditHtml = (): string => readFileSync('dist/audit/index.html', 'utf-8');

const jsonLdBlocks = (html: string): Record<string, unknown>[] => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  return blocks.map(match => JSON.parse(match[1]));
};

describe('Audit page (built)', () => {
  it('displays the indicative package price and no legacy daily rate', () => {
    const html = auditHtml();

    expect(html).toContain('850 €');
    expect(html).toContain('3 à 5 jours');
    expect(html).toContain('2 550 €');
    expect(html).toContain('4 250 €');
    expect(html).not.toContain('800 €');
  });

  it('presents the AI-augmented audit as the method, not an option', () => {
    const html = auditHtml();

    const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
    const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1] ?? '';

    expect(html).toContain("augmenté par l'IA");
    expect(title.toLowerCase()).not.toContain('option');
    expect(description.toLowerCase()).not.toContain('option');
  });

  it('exposes a Service JSON-LD aligned with the displayed price', () => {
    const html = auditHtml();

    const service = jsonLdBlocks(html).find(block => block['@type'] === 'Service');

    expect(service).toEqual(expect.objectContaining({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Audit de code PHP',
      provider: expect.objectContaining({
        '@type': 'Person',
        name: 'Fabien Salles',
      }),
      offers: expect.objectContaining({
        '@type': 'Offer',
        price: '850',
        priceCurrency: 'EUR',
      }),
    }));
  });

  it('resolves every internal anchor to an existing id', () => {
    const html = auditHtml();

    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);

    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) {
      expect(ids).toContain(anchor);
    }
  });

  it('does not link to the draft article', () => {
    const html = auditHtml();

    expect(html).not.toContain('audit-php-pourquoi-les-outils-ne-suffisent-pas');
  });
});
