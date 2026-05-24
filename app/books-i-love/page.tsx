import { Byline, PageShell, PageTitle, Prose, SectionTitle } from "../components/page-shell";

export default function Page() {
  return (
    <PageShell>
      <PageTitle>Books I love</PageTitle>
      <Byline />

      <Prose>
        <SectionTitle>Fiction</SectionTitle>

        <ul className="mt-5">
          <li>The Lord of the Rings</li>
          <li>The Flowers for Algernon</li>
          <li>11/22/63</li>
        </ul>

        <SectionTitle>Non-fiction</SectionTitle>

        <ul className="mt-5">
          <li>Deep Work</li>
          <li>Atomic Habits</li>
          <li>Sapiens</li>
        </ul>
      </Prose>
    </PageShell>
  );
}
