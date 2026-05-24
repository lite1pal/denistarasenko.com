import Link from "next/link";
import { Prose } from "./components/page-shell";

export default function HomeScreen() {
  return (
    <Prose>
      <h1 className="pb-5 text-[22px] font-bold">Denis Tarasenko</h1>

      <p>
        I build <Link href="/work">software</Link> and read a lot of books.
      </p>

      <p>
        Also I recently realized that you always get a better result when you
        remove things.
      </p>

      <p>Not add them.</p>

      <ul className="mt-16">
        <li className="text-base font-normal">
          <Link href="/essays">Essays</Link>
        </li>
        <li className="text-base font-normal">
          <Link href="/work">Work</Link>
        </li>
        <li className="text-base font-normal">
          <Link href="/books-i-love">Books I love</Link>
        </li>
      </ul>
    </Prose>
  );
}
