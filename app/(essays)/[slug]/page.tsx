import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { essays, getEssayBySlug } from "../essays.data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateStaticParams() {
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) {
    return {};
  }

  const url = `https://denistarasenko.com/${essay.slug}`;

  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical: `/${essay.slug}`,
    },
    openGraph: {
      type: "article",
      title: essay.title,
      description: essay.description,
      url,
      publishedTime: `${essay.publishedAt}T00:00:00.000Z`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: essay.title,
    datePublished: essay.publishedAt,
    dateModified: essay.publishedAt,
    author: {
      "@type": "Person",
      name: "Denis Tarasenko",
    },
    mainEntityOfPage: `https://denistarasenko.com/${essay.slug}`,
  };

  return (
    <article>
      <h1 className="essay-title">{essay.title}</h1>

      <Link className="author" href="/">
        By Denis Tarasenko
      </Link>
      <p className="author">{formatDate(essay.publishedAt)}</p>

      {essay.content}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  );
}
