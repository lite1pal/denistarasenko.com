const essays = [
  {
    slug: "why-i-am-building-software-more-slowly-now.html",
    title: "Why I&#39;m building software more slowly now",
    date: "2026-06-04",
  },
  {
    slug: "i-took-back-control-of-my-digital-life.html",
    title: "I took back control of my digital life",
    date: "2026-05-25",
  },
  {
    slug: "why-i-started-coding-manually-again.html",
    title: "Why I started coding manually again",
    date: "2026-05-20",
  },
  {
    slug: "start-before-you-are-ready.html",
    title: "Start before you're ready",
    date: "2025-12-09",
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
