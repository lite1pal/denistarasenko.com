export default function Page() {
  return (
    <article>
      <h1 className="essay-title">Books I love</h1>

      <a className="author" href="/">
        By Denis Tarasenko
      </a>

      <h2 className="mt-5">Fiction</h2>

      <ul className="mt-5">
        <li>The Lord of the Rings</li>
        <li>The Flowers for Algernon</li>
        <li>11/22/63</li>
      </ul>

      <h2 className="mt-5">Non-fiction</h2>

      <ul className="mt-5">
        <li>Deep Work</li>
        <li>Atomic Habits</li>
        <li>Sapiens</li>
      </ul>
    </article>
  );
}
