import Link from "next/link";

export default function Page() {
  return (
    <article>
      <h1 className="essay-title">Essays</h1>

      <Link className="author" href="/">
        By Denis Tarasenko
      </Link>

      <ul className="mt-5">
        <li>
          <a href="/start-before-you-are-ready">Start before you're ready</a>
        </li>
      </ul>
    </article>
  );
}
