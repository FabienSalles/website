import {GET} from '@pages/rss.xml';
import {describe, it, expect, vi} from "vitest";
import { XMLParser } from 'fast-xml-parser';

vi.mock('astro:content', () => ({
  getCollection: () => [
    {
      slug: "first-post",
      data: {
        title: "First Post",
        description: "This is the first post",
        pubDate: new Date("2025-03-04"),
        draft: false,
        categories: ["category1", "category2"],
      },
    },
    {
      id: "post-2",
      slug: "second-post",
      data: {
        title: "Second Post",
        description: "This is the second post",
        pubDate: new Date("2025-03-05"),
        link: "/blog/second-post/",
        draft: false
      },
    },
    {
      id: "post-3",
      slug: "third-post",
      data: {
        title: "Third Post",
        description: "This is the third post",
        pubDate: new Date("2025-03-06"),
        link: "/blog/third-post/",
        draft: true
      },
    }
  ]
}));


describe('RSS Feed', () => {
  it('should render RSS feed', async () => {
    const response = await GET({
      site: new URL('https://fabiensalles.test')
    });

    const parser = new XMLParser();
    const xmlReturned = parser.parse(await response.text());
    const xmlExpected = parser.parse(`
    <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Fabien Salles - Blog</title>
        <description>Articles sur l'artisanat logiciel, le développement et les bonnes pratiques</description>
        <link>https://fabiensalles.test/</link>
        <atom:link href="https://fabiensalles.test/rss.xml/" rel="self" type="application/rss+xml"/>
        <language>fr</language>
        <item>
          <title>Second Post</title>
          <description>This is the second post</description>
          <pubDate>Wed, 05 Mar 2025 00:00:00 GMT</pubDate>
          <link>https://fabiensalles.test/blog/second-post/</link>
          <guid isPermaLink="true">https://fabiensalles.test/blog/second-post/</guid>
        </item>
        <item>
          <title>First Post</title>
          <description>This is the first post</description>
          <pubDate>Tue, 04 Mar 2025 00:00:00 GMT</pubDate>
          <link>https://fabiensalles.test/blog/first-post/</link>
          <guid isPermaLink="true">https://fabiensalles.test/blog/first-post/</guid>
          <category>category1</category>
          <category>category2</category>
        </item>
      </channel>
    </rss>
    `);
    expect({
      'content-type': response.headers.get('Content-Type'),
      status: response.status,
      content: xmlReturned
    }).toEqual({
      'content-type': 'application/xml',
      status: 200,
      content: xmlExpected
    });
  });
});