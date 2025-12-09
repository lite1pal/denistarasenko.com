export default function Page() {
  return (
    <article>
      <h1 className="essay-title">Work</h1>

      <a className="author" href="/">
        By Denis Tarasenko
      </a>

      <h2>Fiction</h2>

      <ul className="mt-5">
        <li>The Lord of the Rings</li>
        <li>The Flowers for Algernon</li>
        <li>11/22/63</li>
      </ul>

      <h2>Non-fiction</h2>

      <ul className="mt-5">
        <li>Deep Work</li>
        <li>Atomic Habits</li>
        <li>Sapiens</li>
      </ul>
    </article>
  );
}
