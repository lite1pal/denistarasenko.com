const essays = [
  {
    slug: "why-i-started-coding-manually-again.html",
    title: "Why I started coding manually again",
    date: "2026-05-20",
  },
  {
    slug: "book-review-what-i-talk-about-when-i-talk-about-running.html",
    title: "Review: What I Talk About When I Talk About Running",
    date: "2026-05-06",
  },
  {
    slug: "start-before-you-are-ready.html",
    title: "Start before you're ready",
    date: "2025-12-09",
  },
  {
    slug: "book-review-harry-potter-and-the-philosopher-s-stone.html",
    title: "Review: Harry Potter and the Philosopher&#39;s Stone",
    date: "2024-12-08",
  },
  {
    slug: "book-review-the-shining.html",
    title: "Review: The Shining",
    date: "2024-10-05",
  },
];

function renderLatestEssays() {
  const list = document.getElementById("latest-essays-list");
  if (!list) return;

  const current = window.location.pathname.replace(/^\//, "");
  const items = essays
    .filter((essay) => essay.slug !== current)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  list.innerHTML = items
    .map((essay) => `<li><a href="${essay.slug}">${essay.title}</a></li>`)
    .join("");
}

renderLatestEssays();
