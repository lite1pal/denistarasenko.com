import Link from "next/link";

export default function Page() {
  return (
    <article>
      <h1 className="essay-title">Why I started coding manually again</h1>

      <Link className="author" href="/">
        By Denis Tarasenko
      </Link>
      <p className="author">May 20, 2026</p>

      <p className="mt-5">Hey friends,</p>

      <p>
        I love coding, I really do, and I&apos;ve been loving it since the
        moment I started learning it (apart from the first few weeks probably).
        It was one of those eye-openers for me when I gradually realized that I
        could build literally anything that&apos;s possible, and not possible as
        well, and even make a decent living from it.
      </p>

      <p>
        Like any self-respected craftsman, over the years I learned how to be
        very efficient in my IDE, mastered{" "}
        <a href="https://www.typing.com/student/lessons" target="_blank">
          speed typing
        </a>{" "}
        with 10 fingers and without looking at the keyboard, and made my hands
        dirty with different frameworks, databases and tools.
      </p>

      <p>And then ai happened.</p>

      <p>Let me describe my stages of how I felt towards ai as it grew:</p>

      <ol className="list-decimal quote">
        <li>woooooooooow</li>
        <li>
          ok it&apos;s not that good yet, coding myself is better and faster
        </li>
        <li>hmm, it&apos;s now good enough to help me write some code</li>
        <li>
          omg I don&apos;t have to code anymore, it does everything for me!
        </li>
        <li>I don&apos;t have to code anymore...</li>
        <li>
          I hate ai, I wish it never existed, I guess I&apos;ll just change my
          profession soon
        </li>
        <li>
          actually I still love coding, all I need to do is spend 80% coding
          myself and 20% accelerating boring stuff with ai.
        </li>
      </ol>

      <p>I think many of you will resonate with me on these feelings.</p>

      <p>
        Last couple of months I worked on a project where ai was mandatory to
        use and I barely saved myself from losing all joy of coding because of
        it. I really thought it was over.
      </p>

      <p>
        But recently I started to force myself not to use it whenever I can and
        only rely on my own brainpower instead, so I could figure things out
        myself (what a concept). It might sound weird, but I actually became not
        only way more happier and calmer, but also more productive because I
        knew exactly what I was doing and where, in comparison to trusting ai to
        do most architectural and structural decisions for you. Unless you have
        an extremely well defined codebase already, ai will hurt you more than
        help, believe me.
      </p>

      <p>
        I decided to give myself a break from React/Next.js world and made a
        challenge of creating a new app with{" "}
        <a href="https://www.ruby-lang.org/en/" target="_blank">
          Ruby on Rails
        </a>
        . I always wanted to have my own invoice generator where I could also
        track clients and have my own cool UI, so that&apos;s what I&apos;m
        building now. And truth to be told, Rails is probably the most
        satisfying way of creating a solid production app quickly, by writing as
        little code as possible. Creating CRUD for a model literally takes{" "}
        <a
          href="https://guides.rubyonrails.org/getting_started.html#resource-routes"
          target="_blank"
        >
          one line of code
        </a>
        , and the same with the auth. Really, give it a try.
      </p>

      <p>
        Anyway, that&apos;s what I&apos;ve been through lately. At the moment
        I&apos;m just trying to take it easy and enjoy every second of the day
        because why not.
      </p>

      <p>Wish you enjoyable coding,</p>

      <p>Denis</p>

      <p>
        <em>P.S just remembered that </em>
        <a href="https://www.youtube.com/watch?v=Z8B4BSi35CI" target="_blank">
          <em>this video</em>
        </a>
        <em> might have actually saved me from ugly burnout thanks to ai</em>
      </p>
    </article>
  );
}
