import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  LatestEssays,
  EssayBreadcrumbs,
} from "@/app/components/essay-navigation";
import NewsletterCta from "@/app/components/newsletter-cta";
import {
  Byline,
  MutedText,
  PageShell,
  PageTitle,
  Prose,
} from "@/app/components/page-shell";
import { essays, getEssayBySlug } from "./essays.data";

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

  const latestEssays = essays
    .filter((entry) => entry.slug !== essay.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <PageShell>
      <EssayBreadcrumbs title={essay.title} />

      <PageTitle>{essay.title}</PageTitle>
      <Byline />
      <MutedText>{formatDate(essay.publishedAt)}</MutedText>

      <Prose>{essay.content}</Prose>

      <NewsletterCta />
      <LatestEssays items={latestEssays} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </PageShell>
  );
}
