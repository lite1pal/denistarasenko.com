import { Byline, PageShell, PageTitle, Prose } from "@/app/components/page-shell";

export default function Page() {
  return (
    <PageShell>
      <PageTitle>Work</PageTitle>
      <Byline />

      <Prose className="mt-5">
        <ul>
          <li>
          <a href="https://nextnative.dev">
            Next.js boilerplate to ship mobile apps
          </a>
          </li>
          <li>
          <a href="https://apps.apple.com/ua/app/lasting-habits/id6736766976">
            Build habits that last
          </a>
          </li>
          <li>
          <a href="https://apps.apple.com/ua/app/sproutly-ai-plant-identifier/id6748902696">
            Learn about plants with AI
          </a>
          </li>
        </ul>
      </Prose>
    </PageShell>
  );
}
