import type { ReactNode } from "react";

export type Essay = {
  slug: string;
  title: string;
  publishedAt: string;
  description: string;
  content: ReactNode;
};

export const essays: Essay[] = [
  {
    slug: "why-i-started-coding-manually-again",
    title: "Why I started coding manually again",
    publishedAt: "2026-05-20",
    description:
      "A personal note about balancing AI-assisted coding with manual craftsmanship.",
    content: (
      <>
        <p className="mt-5">Hey friends,</p>

        <p>
          I love coding, I really do, and I&apos;ve been loving it since the
          moment I started learning it (apart from the first few weeks
          probably). It was one of those eye-openers for me when I gradually
          realized that I could build literally anything that&apos;s possible, and
          not possible as well, and even make a decent living from it.
        </p>

        <p>
          Like any self-respected craftsman, over the years I learned how to be
          very efficient in my IDE, mastered{" "}
          <a href="https://www.typing.com/student/lessons" target="_blank">
            speed typing
          </a>{" "}
          with 10 fingers and without looking at the keyboard, and made my
          hands dirty with different frameworks, databases and tools.
        </p>

        <p>And then ai happened.</p>

        <p>Let me describe my stages of how I felt towards ai as it grew:</p>

        <ol className="list-decimal">
          <li>woooooooooow</li>
          <li>
            ok it&apos;s not that good yet, coding myself is better and faster
          </li>
          <li>hmm, it&apos;s now good enough to help me write some code</li>
          <li>omg I don&apos;t have to code anymore, it does everything for me!</li>
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
          But recently I started to force myself not to use it whenever I can
          and only rely on my own brainpower instead, so I could figure things
          out myself (what a concept). It might sound weird, but I actually
          became not only way more happier and calmer, but also more productive
          because I knew exactly what I was doing and where, in comparison to
          trusting ai to do most architectural and structural decisions for you.
          Unless you have an extremely well defined codebase already, ai will
          hurt you more than help, believe me.
        </p>

        <p>
          I decided to give myself a break from React/Next.js world and made a
          challenge of creating a new app with{" "}
          <a href="https://www.ruby-lang.org/en/" target="_blank">
            Ruby on Rails
          </a>
          . I always wanted to have my own invoice generator where I could also
          track clients and have my own cool UI, so that&apos;s what I&apos;m building
          now. And truth to be told, Rails is probably the most satisfying way
          of creating a solid production app quickly, by writing as little code
          as possible. Creating CRUD for a model literally takes{" "}
          <a
            href="https://guides.rubyonrails.org/getting_started.html#resource-routes"
            target="_blank"
          >
            one line of code
          </a>
          , and the same with the auth. Really, give it a try.
        </p>

        <p>
          Anyway, that&apos;s what I&apos;ve been through lately. At the moment I&apos;m
          just trying to take it easy and enjoy every second of the day because
          why not.
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
      </>
    ),
  },
  {
    slug: "start-before-you-are-ready",
    title: "Start before you're ready",
    publishedAt: "2025-12-09",
    description:
      "On procrastination, accountability, and forcing progress through action.",
    content: (
      <>
        <p className="mt-5">I never feel quite ready before doing something.</p>

        <p>
          {" "}
          It might be anything from: launching a product writing a newsletter
          (like this one) starting a Youtube channel calling my grandma And this
          list might go on forever. Right now I&apos;m stuck at recording a demo
          video for my new product. I&apos;ve done all the heavy lifting already
          (product, landing, docs, support, payments) and this step is literally
          what&apos;s blocking me from moving on with marketing.
        </p>
        <p>
          And what annoys me the most is that I can&apos;t make myself do this. I
          keep making mental excuses that I&apos;m not good enough to make this
          video, my English accent isn&apos;t that perfect, and that it just makes
          no sense. Wrong. It makes perfect sense. This is a roadblock I must
          get through in order to progress and become mentally stronger and more
          resilient. Every journey has one, so here&apos;s mine.
        </p>

        <p>
          A couple of days ago I had a walk with my friend. We usually buy some
          sausages and marshmallows, then make a tiny fire in nature and roast
          them. It&apos;s delicious, lemme tell you.
        </p>

        <p>
          So as we sat enjoying the fire, he asked me about the project I&apos;d
          been working on for months. I was kinda stuck and couldn&apos;t find words
          to say because it was embarrassing for me to acknowledge that I&apos;d
          been actually procrastinating on it for quite some time. So I
          explained to him my &ldquo;issue&rdquo;, so to speak, with this damn demo
          video that kept me moveless. And what he said was: &ldquo;Maybe you should
          allocate the whole day for it, like next Tuesday&rdquo;
        </p>

        <p>
          It sounded so simple and straightforward. I became motivated the
          second he said it. I immediately took out my phone and created a new
          reminder on Tuesday to record it. Suddenly, I remembered a quote about
          taking a responsibility for something you struggle to do (thanks to
          Tim Ferriss), so I suggested to my friend that we should come up with
          a punishment for me in case I fail to get it done by Tuesday. We
          agreed on me sending him $20 if I fail. Not much, but it&apos;ll
          definitely keep me accountable now.
        </p>

        <p>
          Honestly, it felt so liberating. Today is Monday, and I&apos;m writing a
          script for this demo video. Tomorrow I&apos;m spending the whole morning
          recording it.{" "}
          <i>
            (update from the future: I recorded the video and next week made my
            first ever sale)
          </i>
        </p>

        <p>So if you&apos;re in a similar situation like me:</p>

        <ol className="list-decimal">
          <li>call up your friend</li>
          <li>tell about your struggle</li>
          <li>name a deadline</li>
          <li>suggest a payment in case you fail</li>
          <li>finally do your thing with much less stress</li>
        </ol>
      </>
    ),
  },
];

export function getEssayBySlug(slug: string) {
  return essays.find((essay) => essay.slug === slug);
}
