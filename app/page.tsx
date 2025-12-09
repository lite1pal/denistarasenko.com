import Link from "next/link";

export default function HomeScreen() {
  return (
    <div>
      <h1 className="pb-5">Denis Tarasenko</h1>

      <p>
        I build <a href="https://nextnative.dev">software</a> and read a lot of{" "}
        <a href="https://www.goodreads.com/review/list/175721134-denis-tarasenko?shelf=currently-reading">
          books.
        </a>
      </p>

      <p>
        Also I recently realized that you always get a better result when you
        remove things.
      </p>

      <p>Not add them.</p>

      <ul className="mt-16">
        <li>
          <Link href="/essays">Essays</Link>
        </li>
        <li>
          <Link href="/work">Work</Link>
        </li>
        <li>
          <Link href="/books-i-love">Books I love</Link>
        </li>
      </ul>
    </div>
  );
}
