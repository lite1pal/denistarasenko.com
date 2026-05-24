import Link from "next/link";
import { Byline, PageShell, PageTitle, Prose } from "@/app/components/page-shell";
import { essays } from "../[slug]/essays.data";

export default function Page() {
  const sortedEssays = [...essays].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <PageShell>
      <PageTitle>Essays</PageTitle>
      <Byline />

      <Prose className="mt-5">
        <ul>
          {sortedEssays.map((essay) => (
            <li key={essay.slug}>
              <Link href={`/${essay.slug}`}>{essay.title}</Link>
            </li>
          ))}
        </ul>
      </Prose>
    </PageShell>
  );
}
