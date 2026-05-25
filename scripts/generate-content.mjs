import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://denistarasenko.com";
const ROOT = process.cwd();
const ANALYTICS_SCRIPT = `<script
      defer=""
      src="https://analytics.denistarasenko.com/script.js"
      data-website-id="c4fd4a3a-c1eb-40a0-ba15-750124213746"
      data-exclude-search="true"
      data-exclude-hash="true"
    ></script>`;
const ANALYTICS_WEBSITE_ID = "c4fd4a3a-c1eb-40a0-ba15-750124213746";

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

function parseIsoDate(isoDate) {
  const match = String(isoDate).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function parseSupportedDate(value) {
  return parseHumanDate(String(value).trim()) || parseIsoDate(value);
}

function toIsoDate(dateInput) {
  const date = parseSupportedDate(dateInput);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function toRfc822(dateInput) {
  const date = parseSupportedDate(dateInput);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toUTCString();
}

function toHumanDate(dateInput) {
  const date = parseSupportedDate(dateInput);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

async function getHtmlFiles() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name);
}

async function getMarkdownFiles() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

async function validateAnalyticsConfiguration(htmlFiles) {
  const issues = [];

  for (const fileName of htmlFiles) {
    const fullPath = path.join(ROOT, fileName);
    const html = await readFile(fullPath, "utf8");
    if (!html.includes("analytics.denistarasenko.com/script.js")) continue;

    const websiteIdMatch = html.match(/data-website-id="([^"]*)"/i);
    if (!websiteIdMatch) {
      issues.push(`${fileName}: missing data-website-id`);
      continue;
    }

    const websiteId = websiteIdMatch[1].trim();
    if (websiteId !== ANALYTICS_WEBSITE_ID) {
      issues.push(
        `${fileName}: unexpected data-website-id "${websiteId}" (expected "${ANALYTICS_WEBSITE_ID}")`,
      );
    }

    if (websiteId.includes("\n") || websiteId.includes("\r")) {
      issues.push(`${fileName}: data-website-id contains a line break`);
    }
  }

  if (issues.length) {
    throw new Error(`Analytics configuration errors:\n- ${issues.join("\n- ")}`);
  }
}

function slugToTitle(slug) {
  return slug
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function fileNameToSlug(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(mdText) {
  const match = mdText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { meta: {}, body: mdText.trim() };
  }

  const meta = {};
  const rawMeta = match[1].split("\n");
  for (const line of rawMeta) {
    const kv = line.match(/^\s*([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    meta[kv[1].toLowerCase()] = kv[2].trim().replace(/^['"]|['"]$/g, "");
  }

  const body = mdText.slice(match[0].length).trim();
  return { meta, body };
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseInlineMarkdown(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (_m, alt, src, title) => {
      const trimmedSrc = src.trim().replace(/^\/+/, "");
      const publicSrc = `/public/${trimmedSrc.replace(/^public\//, "")}`;
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<img src="${publicSrc}" alt="${escapeHtml(alt || "")}" loading="lazy" decoding="async" style="max-width: 100%; height: auto; padding-bottom: 30px;"${titleAttr} />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function markdownToHtmlBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+/);
    if (olMatch) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(`<ol>\n${items.map((item) => `  <li>${parseInlineMarkdown(item)}</li>`).join("\n")}\n</ol>`);
      continue;
    }

    const ulMatch = line.match(/^[-*]\s+/);
    if (ulMatch) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(`<ul>\n${items.map((item) => `  <li>${parseInlineMarkdown(item)}</li>`).join("\n")}\n</ul>`);
      continue;
    }

    const paragraphLines = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^\d+\.\s+/.test(lines[i].trim()) && !/^[-*]\s+/.test(lines[i].trim())) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push(`<p>${parseInlineMarkdown(paragraphLines.join(" "))}</p>`);
  }

  return blocks;
}

function firstImageSrcFromHtml(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function buildEssayHtml({ title, date, description, bodyHtml, slug }) {
  const isoDate = toIsoDate(date);
  if (!isoDate) {
    throw new Error(`Could not convert essay date to ISO for ${slug}: ${date}`);
  }
  const canonicalUrl = `${SITE_URL}/${slug}`;
  const ogImage = firstImageSrcFromHtml(bodyHtml);
  const ogImageUrl = ogImage
    ? (ogImage.startsWith("http://") || ogImage.startsWith("https://")
      ? ogImage
      : `${SITE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`)
    : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: "Denis Tarasenko",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Denis Tarasenko",
      url: SITE_URL,
    },
    datePublished: isoDate,
    dateModified: isoDate,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  };
  if (ogImageUrl) {
    jsonLd.image = [ogImageUrl];
  }
  const jsonLdRaw = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | Denis Tarasenko</title>
    <meta
      name="description"
      content="${escapeHtml(description)}"
    />
    <meta name="author" content="Denis Tarasenko" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Denis Tarasenko" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    ${ogImageUrl ? `<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />` : ""}
    <meta property="article:published_time" content="${isoDate}" />
    <meta name="twitter:card" content="${ogImageUrl ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${ogImageUrl ? `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />` : ""}
    <script type="application/ld+json">${jsonLdRaw}</script>
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
            <a href="essays.html" class="muted-link">Essays</a> / ${escapeHtml(title)}
          </p>

          <h1>${escapeHtml(title)}</h1>
          <a href="index.html" class="author">By Denis Tarasenko</a>
          <time class="date" datetime="${isoDate}">${escapeHtml(date)}</time>

          ${bodyHtml}

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

async function generateEssayHtmlFromMarkdown() {
  const mdFiles = await getMarkdownFiles();
  let generated = 0;

  for (const mdFile of mdFiles) {
    const fullPath = path.join(ROOT, mdFile);
    const mdText = await readFile(fullPath, "utf8");
    const { meta, body } = parseFrontmatter(mdText);

    const title = meta.title || slugToTitle(mdFile);
    const rawDate = meta.date;
    if (!rawDate) {
      throw new Error(`Missing required "date" in frontmatter for ${mdFile}.`);
    }
    const date = toHumanDate(rawDate);
    if (!date) {
      throw new Error(
        `Invalid date format in frontmatter for ${mdFile}: ${rawDate}. Use YYYY-MM-DD or Mon D, YYYY.`,
      );
    }

    const description = meta.description || "Essay by Denis Tarasenko.";
    const htmlFile = `${fileNameToSlug(mdFile)}.html`;
    const bodyBlocks = markdownToHtmlBlocks(body);
    if (bodyBlocks.length === 0) {
      throw new Error(`Markdown file has no content body: ${mdFile}`);
    }
    bodyBlocks[0] = bodyBlocks[0].replace("<p>", '<p class="spacer-top">');

    const html = buildEssayHtml({
      title,
      date,
      description,
      bodyHtml: bodyBlocks.join("\n\n          "),
      slug: htmlFile,
    });

    await writeFile(path.join(ROOT, htmlFile), html, "utf8");
    generated += 1;
  }

  return generated;
}

async function parseEssay(fileName) {
  if (fileName.startsWith("book-review-") || fileName.startsWith("goodreads-review-")) {
    return null;
  }

  const fullPath = path.join(ROOT, fileName);
  const html = await readFile(fullPath, "utf8");

  const titleRaw = textBetween(html, /<h1[^>]*>/i, /<\/h1>/i);
  const dateRawMatch = html.match(
    /<(?:p|time)[^>]*class="date"[^>]*>([\s\S]*?)<\/(?:p|time)>/i,
  );
  const dateRaw = dateRawMatch ? stripTags(dateRawMatch[1]) : "";
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

function isCanonicalEssaySlug(slug) {
  return !/\s/.test(slug) && /^[a-z0-9-]+\.html$/i.test(slug);
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

function buildEssaysIndexHtml(essays) {
  const items = essays
    .map(
      (essay) =>
        `            <li>\n              <a href="${essay.slug}">${escapeHtml(essay.title)}</a>\n            </li>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Essays | Denis Tarasenko</title>
    <meta name="description" content="Essays by Denis Tarasenko." />
    <link rel="icon" href="favicon.ico" />
    <link rel="stylesheet" href="styles.css" />
    ${ANALYTICS_SCRIPT}
  </head>
  <body>
    <main class="page">
      <div class="container">
        <!--# include virtual="/partials/navbar.html" -->

        <article class="article">
          <h1>Essays</h1>
          <a href="index.html" class="author">By Denis Tarasenko</a>

          <ul class="spacer-top">
${items}
          </ul>
        </article>
      </div>
    </main>
  </body>
</html>
`;
}

async function main() {
  const generatedFromMarkdown = await generateEssayHtmlFromMarkdown();
  const htmlFiles = await getHtmlFiles();
  await validateAnalyticsConfiguration(htmlFiles);
  const essayCandidates = await Promise.all(htmlFiles.map(parseEssay));
  const essaysByIdentity = new Map();
  for (const essay of essayCandidates.filter(Boolean)) {
    const key = `${essay.title.toLowerCase()}|${essay.date}`;
    const current = essaysByIdentity.get(key);
    if (!current) {
      essaysByIdentity.set(key, essay);
      continue;
    }

    if (isCanonicalEssaySlug(essay.slug) && !isCanonicalEssaySlug(current.slug)) {
      essaysByIdentity.set(key, essay);
    }
  }

  const essays = Array.from(essaysByIdentity.values()).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  if (essays.length === 0) {
    throw new Error("No essays found. Expected pages with <h1> and <p class=\"date\">.");
  }

  await writeFile(path.join(ROOT, "latest-essays.js"), buildLatestEssaysJs(essays), "utf8");
  await writeFile(path.join(ROOT, "essays.html"), buildEssaysIndexHtml(essays), "utf8");
  await writeFile(path.join(ROOT, "sitemap.xml"), buildSitemapXml(htmlFiles), "utf8");
  await writeFile(path.join(ROOT, "feed.xml"), buildRssXml(essays), "utf8");

  console.log(
    `Generated ${generatedFromMarkdown} HTML page(s) from Markdown and updated essays.html, latest-essays.js, sitemap.xml, feed.xml from ${essays.length} essay(s).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
