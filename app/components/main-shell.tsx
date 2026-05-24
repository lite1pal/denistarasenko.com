"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteNav from "./site-nav";

export default function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      className={`mx-auto flex min-h-screen max-w-xl px-4 lg:px-0 flex-col items-center ${isHome ? "justify-center" : "justify-start"}`}
    >
      <SiteNav />
      {children}
    </main>
  );
}
