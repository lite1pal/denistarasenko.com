import {
  Byline,
  PageShell,
  PageTitle,
  Prose,
} from "@/app/components/page-shell";
import { work } from "./work.data";

export default function Page() {
  return (
    <PageShell>
      <PageTitle>Work</PageTitle>
      <Byline />

      <Prose className="mt-5">
        <ul>
          {work.map((w) => (
            <li>
              <a href={w.href} target="_blank">
                {w.title}{" "}
              </a>
            </li>
          ))}
        </ul>
      </Prose>
    </PageShell>
  );
}
