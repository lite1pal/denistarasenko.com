import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BOOKS_HTML = path.join(ROOT, 'books.html');
const ENGLISH_ONLY = process.env.GOODREADS_EN_ONLY !== 'false';

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

function toTimestamp(value) {
  const ts = Date.parse(String(value).trim());
  return Number.isFinite(ts) ? ts : 0;
}

function normalizeTitle(title) {
  return normalizeWhitespace(String(title).split(':')[0] || title);
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
    const pubDate = readTag(itemXml, 'pubDate');
    const userRating = parseNumericTag(readTag(itemXml, 'user_rating'));
    const description = readTag(itemXml, 'description');
    const userReview = normalizeWhitespace(stripHtml(readTag(itemXml, 'user_review')));
    const rating = userRating ?? parseRating(description);
    const bookLink = bookId ? `https://www.goodreads.com/book/show/${bookId}` : '';
    const sortTs = toTimestamp(userReadAt) || toTimestamp(pubDate);

    if (!title || rating !== 5) continue;
    if (ENGLISH_ONLY && !isLikelyEnglishTitle(title)) continue;

    const key = bookId || isbn || `${title}::${author}`;
    items.push({ key, title, author, link: bookLink, review: userReview, sortTs });
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
    const safeReview = escapeHtml(book.review || '');
    const reviewLine = safeReview ? `\n    <div class="book-review">${safeReview}</div>` : '';
    if (book.link) {
      return `  <li class="book-item"><a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>${reviewLine}</li>`;
    }
    return `  <li class="book-item">${safeTitle}${reviewLine}</li>`;
  });

  return `<ul class="spacer-top books-list">\n${lines.join('\n')}\n</ul>`;
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

const booksHtml = await readFile(BOOKS_HTML, 'utf8');
const managedBlock = renderBooksList(books);
const updatedHtml = replaceManagedBlock(booksHtml, managedBlock);

await writeFile(BOOKS_HTML, updatedHtml, 'utf8');

console.log(`Updated books.html with ${books.length} five-star books.`);
