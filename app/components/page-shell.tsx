import Link from "next/link";
import type { ReactNode } from "react";

const mutedTextClass = "text-sm text-gray-500 dark:text-[rgb(190,190,190)]";

export function PageShell({ children }: { children: ReactNode }) {
  return <article className="w-full py-[100px]">{children}</article>;
}

export function PageTitle({
  children,
  light = true,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <h1
      className={`text-[22px] leading-normal ${light ? "font-normal" : "font-bold"}`}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-5 text-[18px] font-bold leading-normal">{children}</h2>
  );
}

export function Byline() {
  return (
    <Link className={`${mutedTextClass} border-none no-underline`} href="/">
      By Denis Tarasenko
    </Link>
  );
}

export function MutedText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`${mutedTextClass} pb-0 ${className}`}>{children}</p>;
}

export function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`[&_a]:border-b [&_a]:border-black/50 [&_a]:no-underline dark:[&_a]:border-white/50 [&_li]:text-[16px] [&_li]:font-normal [&_li]:leading-normal [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-[50px] [&_p]:pb-5 [&_p]:text-[16px] [&_p]:font-normal [&_p]:leading-normal ${className}`}
    >
      {children}
    </div>
  );
}
