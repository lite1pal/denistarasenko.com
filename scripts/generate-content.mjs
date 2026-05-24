import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://denistarasenko.com";
const ROOT = process.cwd();

function textBetween(input, startRegex, endRegex) {
  const startMatch = input.match(startRegex);
  if (!startMatch) return "";
  const from = startMatch.index + startMatch[0].length;
  const rest = input.slice(from);
  const endMatch = rest.match(endRegex);
  if (!endMatch) return "";
  return rest.slice(0, endMatch.index).trim();
}

function stripTags(input) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseHumanDate(humanDate) {
  const match = humanDate.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return null;

  const months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const month = months[match[1].slice(0, 3).toLowerCase()];
  if (month === undefined) return null;

  const day = Number(match[2]);
  const year = Number(match[3]);
  if (!Number.isInteger(day) || !Number.isInteger(year)) return null;

  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

function toIsoDate(humanDate) {
  const date = parseHumanDate(humanDate);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function toRfc822(humanDate) {
  const date = parseHumanDate(humanDate);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toUTCString();
}

async function getHtmlFiles() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name);
}

async function parseEssay(fileName) {
  const fullPath = path.join(ROOT, fileName);
  const html = await readFile(fullPath, "utf8");

  const titleRaw = textBetween(html, /<h1[^>]*>/i, /<\/h1>/i);
  const dateRaw = textBetween(html, /<p class="date"[^>]*>/i, /<\/p>/i);
  if (!titleRaw || !dateRaw) return null;

  const metaDescriptionMatch = html.match(
    /<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i,
  );
  const description = metaDescriptionMatch ? metaDescriptionMatch[1].trim() : "";

  const isoDate = toIsoDate(dateRaw);
  const rssDate = toRfc822(dateRaw);
  if (!isoDate || !rssDate) {
    throw new Error(`Could not parse date in ${fileName}: ${dateRaw}`);
  }

  return {
    slug: fileName,
    title: stripTags(titleRaw),
    date: isoDate,
    rssDate,
    description,
  };
}

function buildLatestEssaysJs(essays) {
  const items = essays
    .map(
      (essay) => `  {\n    slug: "${essay.slug}",\n    title: "${essay.title.replace(/\"/g, "\\\"")}",\n    date: "${essay.date}",\n  },`,
    )
    .join("\n");

  return `const essays = [\n${items}\n];\n\nfunction renderLatestEssays() {\n  const list = document.getElementById("latest-essays-list");\n  if (!list) return;\n\n  const current = window.location.pathname.replace(/^\\//, "");\n  const items = essays\n    .filter((essay) => essay.slug !== current)\n    .sort((a, b) => new Date(b.date) - new Date(a.date))\n    .slice(0, 3);\n\n  list.innerHTML = items\n    .map((essay) => \`<li><a href="\${essay.slug}">\${essay.title}</a></li>\`)\n    .join("");\n}\n\nrenderLatestEssays();\n`;
}

function buildSitemapXml(htmlFiles) {
  const urls = new Set();
  urls.add(`${SITE_URL}/`);
  for (const file of htmlFiles) {
    if (file === "index.html") continue;
    urls.add(`${SITE_URL}/${file}`);
  }

  const lines = Array.from(urls)
    .sort()
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines}\n</urlset>\n`;
}

function buildRssXml(essays) {
  const items = essays
    .map((essay) => {
      const link = `${SITE_URL}/${essay.slug}`;
      return `    <item>\n      <title>${escapeXml(essay.title)}</title>\n      <link>${escapeXml(link)}</link>\n      <guid>${escapeXml(link)}</guid>\n      <pubDate>${escapeXml(essay.rssDate)}</pubDate>\n      <description>${escapeXml(essay.description)}</description>\n    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Denis Tarasenko Essays</title>\n    <link>${SITE_URL}/essays.html</link>\n    <description>Essays by Denis Tarasenko</description>\n    <language>en-us</language>\n${items}\n  </channel>\n</rss>\n`;
}

async function main() {
  const htmlFiles = await getHtmlFiles();
  const essayCandidates = await Promise.all(htmlFiles.map(parseEssay));
  const essays = essayCandidates
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (essays.length === 0) {
    throw new Error("No essays found. Expected pages with <h1> and <p class=\"date\">.");
  }

  await writeFile(path.join(ROOT, "latest-essays.js"), buildLatestEssaysJs(essays), "utf8");
  await writeFile(path.join(ROOT, "sitemap.xml"), buildSitemapXml(htmlFiles), "utf8");
  await writeFile(path.join(ROOT, "feed.xml"), buildRssXml(essays), "utf8");

  console.log(`Generated latest-essays.js, sitemap.xml, feed.xml from ${essays.length} essay(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
