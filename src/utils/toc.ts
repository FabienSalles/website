import type { MarkdownHeading } from 'astro';

/**
 * Minimum number of top-level (H2) sections required for an article to display
 * a table of contents. Articles with fewer H2s render without a ToC.
 */
export const TOC_MIN_HEADINGS = 4;

/**
 * Single source of truth for whether a given article should display a ToC.
 * Used by both the blog post layout (to reserve a column) and the
 * TableOfContents component (to gate its rendering). Keeping the rule here
 * prevents the layout and the component from drifting out of sync.
 */
export function shouldRenderToc(
  headings: MarkdownHeading[],
  minHeadings: number = TOC_MIN_HEADINGS
): boolean {
  const h2Count = headings.filter((heading) => heading.depth === 2).length;
  return h2Count >= minHeadings;
}

/**
 * Top-level section as displayed in the ToC: an H2 with its child H3s.
 * Sections appear in document order; their `children` are also in document
 * order — the active-section detection in the client script depends on this.
 */
export type TocSection = {
  heading: MarkdownHeading;
  children: MarkdownHeading[];
};

/**
 * Build the ToC tree by attaching each H3 to the most recent H2.
 * H1 and H4+ are ignored. The natural HTML hierarchy of the article drives
 * the structure — no regex on heading text, no convention to remember.
 */
export function buildTocSections(headings: MarkdownHeading[]): TocSection[] {
  const sections: TocSection[] = [];

  for (const heading of headings) {
    if (heading.depth === 2) {
      sections.push({ heading, children: [] });
    } else if (heading.depth === 3 && sections.length > 0) {
      sections[sections.length - 1].children.push(heading);
    }
  }

  return sections;
}
