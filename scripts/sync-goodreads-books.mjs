import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BOOKS_HTML = path.join(ROOT, 'books.html');
const BOOKS_FEED_XML = path.join(ROOT, 'books-feed.xml');
const ENGLISH_ONLY = process.env.GOODREADS_EN_ONLY !== 'false';
const SITE_URL = 'https://denistarasenko.com';
const REVIEW_PAGE_PREFIX = 'book-review-';
const LEGACY_REVIEW_PAGE_PREFIX = 'goodreads-review-';
const ANALYTICS_SCRIPT = `<script
      defer=""
      src="https://analytics.denistarasenko.com/script.js"
      data-website-id="d149d048-b9f5-468c-be25-0c30e20d04f5"
      data-exclude-search="true"
      data-exclude-hash="true"
    ></script>`;

const GOODREADS_USER_ID = process.env.GOODREADS_USER_ID;
const GOODREADS_FEED_URL = process.env.GOODREADS_FEED_URL ||
  (GOODREADS_USER_ID
    ? `https://www.goodreads.com/review/list_rss/${encodeURIComponent(GOODREADS_USER_ID)}?shelf=read`
    : null);

if (!GOODREADS_FEED_URL) {
  console.error('Missing Goodreads source. Set GOODREADS_USER_ID or GOODREADS_FEED_URL.');
  process.exit(1);
}

function decodeXml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripCdata(text) {
  const match = String(text).trim().match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return match ? match[1] : text;
}

function readTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i'));
  if (!match) return '';
  return decodeXml(stripCdata(match[1].trim()));
}

function parseRating(description) {
  const match = description.match(/rating:\s*(\d+)/i);
  if (!match) return null;
  const rating = Number(match[1]);
  return Number.isFinite(rating) ? rating : null;
}

function parseNumericTag(value) {
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

function normalizeWhitespace(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

function toHumanDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function toIsoDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isLikelyEnglishTitle(title) {
  // Exclude titles containing Cyrillic characters.
  return !/[\u0400-\u04FF]/.test(title);
}

function stripHtml(text) {
  return String(text).replace(/<[^>]+>/g, ' ');
}

function extractReviewParagraphs(userReviewHtml) {
  const normalized = String(userReviewHtml)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '');
  const plain = stripHtml(normalized)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!plain) return [];
  return plain
    .split(/\n\s*\n/)
    .map((p) => normalizeWhitespace(p))
    .filter(Boolean);
}

function toTimestamp(value) {
  const ts = Date.parse(String(value).trim());
  return Number.isFinite(ts) ? ts : 0;
}

function normalizeTitle(title) {
  const beforeColon = normalizeWhitespace(String(title).split(':')[0] || title);
  return normalizeWhitespace(beforeColon.replace(/\s*\([^)]*\)\s*$/g, ''));
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function buildReviewPageFileName(_bookId, title) {
  const titleSlug = slugify(title) || 'book';
  return `${REVIEW_PAGE_PREFIX}${titleSlug}.html`;
}

function buildReviewDescription(paragraphs, title) {
  if (!paragraphs.length) return `My Goodreads review of ${title}.`;
  const snippet = paragraphs[0].slice(0, 150);
  return `${snippet}${paragraphs[0].length > 150 ? '...' : ''}`;
}

function buildReviewHtmlPage({ title, reviewParagraphs, pageFileName, reviewPublishedAt }) {
  const pageUrl = `${SITE_URL}/${pageFileName}`;
  const isoDate = toIsoDate(reviewPublishedAt) || new Date().toISOString().slice(0, 10);
  const humanDate = toHumanDate(reviewPublishedAt) || toHumanDate(new Date().toISOString());
  const description = buildReviewDescription(reviewParagraphs, title);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: `Review: ${title}`,
    description,
    author: {
      '@type': 'Person',
      name: 'Denis Tarasenko',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Denis Tarasenko',
      url: SITE_URL,
    },
    datePublished: isoDate,
    dateModified: isoDate,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
  }).replace(/</g, '\\u003c');
  const body = reviewParagraphs
    .map((p, idx) => `          <p${idx === 0 ? ' class="spacer-top"' : ''}>${escapeHtml(p)}</p>`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Review: ${escapeHtml(title)} | Denis Tarasenko</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Denis Tarasenko" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${escapeHtml(pageUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Denis Tarasenko" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="Review: ${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="article:published_time" content="${isoDate}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Review: ${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <script type="application/ld+json">${jsonLd}</script>
    <link rel="alternate" type="application/rss+xml" title="Denis Tarasenko Essays RSS" href="https://denistarasenko.com/feed.xml" />
    <link rel="icon" href="favicon.ico" />
    <link rel="stylesheet" href="styles.css" />
    ${ANALYTICS_SCRIPT}
  </head>
  <body>
    <main class="page">
      <div class="container">
        <!--# include virtual="/partials/navbar.html" -->

        <article class="article">
          <p class="breadcrumb">
            <a href="index.html" class="muted-link">Home</a> /
            <a href="books.html" class="muted-link">Books</a> / Review: ${escapeHtml(title)}
          </p>

          <h1>Review: ${escapeHtml(title)}</h1>
          <a href="index.html" class="author">By Denis Tarasenko</a>
          <time class="date" datetime="${isoDate}">${escapeHtml(humanDate)}</time>
${body}

          <!--# include virtual="/partials/latest-essays.html" -->

          <!--# include virtual="/partials/newsletter.html" -->
        </article>
      </div>
    </main>
    <script src="latest-essays.js?v=1"></script>
    <script src="newsletter.js?v=4"></script>
  </body>
</html>
`;
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
}

function buildBooksFeedXml(books) {
  const items = books
    .map((book) => {
      const itemUrl = book.reviewPage
        ? `${SITE_URL}/${book.reviewPage}`
        : book.link;
      const description = book.reviewParagraphs.length
        ? buildReviewDescription(book.reviewParagraphs, book.title)
        : `Book note: ${book.title}`;
      return `    <item>
      <title>${escapeXml(book.title)}</title>
      <link>${escapeXml(itemUrl)}</link>
      <guid>${escapeXml(itemUrl)}</guid>
      <pubDate>${escapeXml(toRfc822(book.userReadAt || book.sortTs))}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Denis Tarasenko Books</title>
    <link>${SITE_URL}/books.html</link>
    <description>Books Denis Tarasenko rated 4-5 stars on Goodreads.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
}

function parseItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml))) {
    const itemXml = itemMatch[1];
    const title = normalizeTitle(readTag(itemXml, 'title'));
    const author = normalizeWhitespace(readTag(itemXml, 'author_name'));
    const bookId = readTag(itemXml, 'book_id');
    const isbn = readTag(itemXml, 'isbn');
    const userReadAt = readTag(itemXml, 'user_read_at');
    const userDateCreated = readTag(itemXml, 'user_date_created');
    const pubDate = readTag(itemXml, 'pubDate');
    const userRating = parseNumericTag(readTag(itemXml, 'user_rating'));
    const description = readTag(itemXml, 'description');
    const rawUserReview = readTag(itemXml, 'user_review');
    const reviewParagraphs = extractReviewParagraphs(rawUserReview);
    const rating = userRating ?? parseRating(description);
    const bookLink = bookId ? `https://www.goodreads.com/book/show/${bookId}` : '';
    const sortTs = toTimestamp(userReadAt) || toTimestamp(pubDate);

    if (!title || rating < 4) continue;
    if (ENGLISH_ONLY && !isLikelyEnglishTitle(title)) continue;

    const key = bookId || isbn || `${title}::${author}`;
    const reviewPage = reviewParagraphs.length ? buildReviewPageFileName(bookId, title) : '';
    items.push({
      key,
      bookId,
      title,
      author,
      link: bookLink,
      reviewParagraphs,
      reviewPage,
      userReadAt,
      userDateCreated,
      sortTs,
    });
  }

  const deduped = new Map();
  for (const item of items) {
    if (!deduped.has(item.key)) deduped.set(item.key, item);
  }

  return [...deduped.values()].sort((a, b) => b.sortTs - a.sortTs);
}

function renderBooksList(books) {
  if (!books.length) {
    return '<p class="spacer-top">No 5-star books found on your Goodreads read shelf yet.</p>';
  }

  const lines = books.map((book) => {
    const safeTitle = escapeHtml(book.title);
    const safeLink = escapeHtml(book.link);
    const reviewButton = book.reviewPage
      ? ` <a class="review-link" href="${escapeHtml(book.reviewPage)}">read my review</a>`
      : '';
    if (book.link) {
      return `  <li class="book-item"><a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>${reviewButton}</li>`;
    }
    return `  <li class="book-item">${safeTitle}${reviewButton}</li>`;
  });

  return `<ul class="spacer-top books-list">\n${lines.join('\n')}\n</ul>`;
}

async function syncReviewPages(books) {
  const currentFiles = await readdir(ROOT, { withFileTypes: true });
  const existingGenerated = currentFiles
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.html') &&
        (entry.name.startsWith(REVIEW_PAGE_PREFIX) || entry.name.startsWith(LEGACY_REVIEW_PAGE_PREFIX)),
    )
    .map((entry) => entry.name);

  const needed = new Set();
  const usedFileNames = new Set();
  for (const book of books) {
    if (!book.reviewParagraphs.length) continue;
    let pageFileName = buildReviewPageFileName(book.bookId, book.title);
    if (usedFileNames.has(pageFileName)) {
      const fallbackSlug = slugify(`${book.title}-${book.bookId || book.key}`) || `book-${Date.now()}`;
      pageFileName = `${REVIEW_PAGE_PREFIX}${fallbackSlug}.html`;
    }
    usedFileNames.add(pageFileName);
    needed.add(pageFileName);
    book.reviewPage = pageFileName;
    const html = buildReviewHtmlPage({
      title: book.title,
      reviewParagraphs: book.reviewParagraphs,
      pageFileName,
      reviewPublishedAt: book.userDateCreated || book.userReadAt,
    });
    await writeFile(path.join(ROOT, pageFileName), html, 'utf8');
  }

  for (const fileName of existingGenerated) {
    if (!needed.has(fileName)) {
      await unlink(path.join(ROOT, fileName));
    }
  }
}

function replaceManagedBlock(html, replacement) {
  const start = '<!-- GOODREADS_5_STAR_START -->';
  const end = '<!-- GOODREADS_5_STAR_END -->';

  if (!html.includes(start) || !html.includes(end)) {
    throw new Error('books.html is missing Goodreads managed markers.');
  }

  return html.replace(
    new RegExp(`${start}[\\s\\S]*?${end}`),
    `${start}\n${replacement}\n          ${end}`,
  );
}

const response = await fetch(GOODREADS_FEED_URL, {
  headers: { 'User-Agent': 'books-sync-script/1.0' },
});

if (!response.ok) {
  console.error(`Failed to fetch Goodreads feed: HTTP ${response.status}`);
  process.exit(1);
}

const xml = await response.text();
const books = parseItems(xml);
await syncReviewPages(books);
await writeFile(BOOKS_FEED_XML, buildBooksFeedXml(books), 'utf8');

const booksHtml = await readFile(BOOKS_HTML, 'utf8');
const managedBlock = renderBooksList(books);
const updatedHtml = replaceManagedBlock(booksHtml, managedBlock);

await writeFile(BOOKS_HTML, updatedHtml, 'utf8');

console.log(`Updated books.html with ${books.length} five-star books.`);
