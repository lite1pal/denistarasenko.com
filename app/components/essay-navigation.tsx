import Link from "next/link";
import { Prose } from "./page-shell";

type EssayListItem = {
  slug: string;
  title: string;
};

export function EssayBreadcrumbs({ title }: { title: string }) {
  return (
    <p className="pb-5 text-sm text-gray-500 dark:text-[rgb(190,190,190)]">
      <Link className="border-none no-underline" href="/">
        Home
      </Link>{" "}
      /{" "}
      <Link className="border-none no-underline" href="/essays">
        Essays
      </Link>{" "}
      / {title}
    </p>
  );
}

export function LatestEssays({ items }: { items: EssayListItem[] }) {
  return (
    <section className="mt-[70px]">
      <h2 className="text-[18px] font-bold leading-normal">Latest essays</h2>
      <Prose className="mt-5">
        <ul>
          {items.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/${entry.slug}`}>{entry.title}</Link>
            </li>
          ))}
        </ul>
      </Prose>
    </section>
  );
}
