"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav
      className="flex w-full justify-between pt-7 text-base text-gray-500 dark:text-[rgb(190,190,190)]"
      aria-label="Primary"
    >
      <Link className="border-none no-underline" href="/">
        Denis Tarasenko
      </Link>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link className="border-none no-underline" href="/essays">
          Essays
        </Link>
        <Link className="border-none no-underline" href="/work">
          Work
        </Link>
        <Link className="border-none no-underline" href="/books-i-love">
          Books
        </Link>
      </div>
    </nav>
  );
}
