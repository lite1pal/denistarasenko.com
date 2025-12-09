import Link from "next/link";

export default function Page() {
  return (
    <article>
      <h1 className="essay-title">Work</h1>

      <Link className="author" href="/">
        By Denis Tarasenko
      </Link>

      <ul className="mt-5">
        <li>
          <a href="https://nextnative.dev">
            Next.js boilerplate to ship mobile apps
          </a>
        </li>
        <li>
          <a href="https://apps.apple.com/ua/app/lasting-habits/id6736766976">
            Build habits that last
          </a>
        </li>
        <li>
          <a href="https://apps.apple.com/ua/app/sproutly-ai-plant-identifier/id6748902696">
            Learn about plants with AI
          </a>
        </li>
      </ul>
    </article>
  );
}
