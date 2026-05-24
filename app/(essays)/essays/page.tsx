import Link from "next/link";
import { essays } from "../[slug]/essays.data";

export default function Page() {
  const sortedEssays = [...essays].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <article>
      <h1 className="essay-title">Essays</h1>

      <Link className="author" href="/">
        By Denis Tarasenko
      </Link>

      <ul className="mt-5">
        {sortedEssays.map((essay) => (
          <li key={essay.slug}>
            <Link href={`/${essay.slug}`}>{essay.title}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
