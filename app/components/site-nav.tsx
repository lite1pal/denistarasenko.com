"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="site-nav justify-between" aria-label="Primary">
      <Link href="/">Denis Tarasenko</Link>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/essays">Essays</Link>
        <Link href="/work">Work</Link>
        <Link href="/books-i-love">Books</Link>
      </div>
    </nav>
  );
}
