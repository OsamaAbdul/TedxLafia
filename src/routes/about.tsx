import { createFileRoute } from "@tanstack/react-router";
import lafia from "@/assets/lafia-aerial.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { RegisterBanner } from "@/components/site/RegisterBanner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TEDxLafia — Ideas Worth Spreading in Nasarawa" },
      {
        name: "description",
        content:
          "TEDxLafia is a volunteer-run, independently organized TED event in Lafia, Nasarawa State, built to put local ideas on a global stage.",
      },
      { property: "og:title", content: "About TEDxLafia" },
      {
        property: "og:description",
        content: "Who we are, why Lafia, and how a TEDx event actually works.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  {
    title: "Ideas before status",
    body: "We curate for the strength of the idea, not the size of the following. A first-time speaker with a tested idea beats a famous voice with a familiar one.",
  },
  {
    title: "Rooted in Lafia",
    body: "Every edition draws at least half its speakers from Nasarawa State. Our stories should be told by the people living them.",
  },
  {
    title: "Craft in everything",
    body: "Rehearsed talks, honest staging, careful sound, and a room that respects the audience's attention from the first minute to the last.",
  },
  {
    title: "Open afterwards",
    body: "Talks are recorded and published free, so an idea shared with a hundred people in a room can reach a hundred thousand outside it.",
  },
];

const TIMELINE = [
  { year: "2024", text: "A small reading group in Lafia starts asking why Nasarawa's best ideas keep travelling to Abuja to be heard." },
  { year: "2025", text: "The licence application goes in. Volunteers gather: curators, producers, designers, a sound crew and a lot of coffee." },
  { year: "2026", text: "TEDxLafia holds its inaugural edition — eight talks, one red circle, a full room." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            A stage for the ideas
            <span className="block italic text-primary">already here.</span>
          </>
        }
        description="TEDxLafia is an independently organized TED event, run by volunteers in Lafia, Nasarawa State. We exist because our city is full of people solving real problems, and far too few of them have ever been handed a microphone."
        aside={
          <div className="border-l-2 border-primary pl-5">
            <p className="eyebrow text-muted-foreground">Licensed by TED</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              In the spirit of ideas worth spreading, TED created TEDx: a programme of local,
              self-organized events that bring people together to share a TED-like experience.
            </p>
          </div>
        }
      />

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <img
                src={lafia}
                alt="Rooftops and open land across Lafia, Nasarawa State"
                className="h-full w-full object-cover grayscale-[40%]"
                width={960}
                height={1200}
                loading="lazy"
              />
              <span className="absolute top-0 right-0 h-2 w-1/2 bg-primary" />
            </div>
          </Reveal>
          <div className="self-center">
            <SectionHeading
              eyebrow="Why Lafia"
              title="A city that has always thought out loud"
              description="Lafia sits at the crossroads of Nigeria's middle belt — a meeting point of farmers and traders, of languages and faiths, of tradition and a very young population in a hurry."
            />
            <Reveal delay={0.1} className="mt-8 grid gap-6 text-muted-foreground">
              <p className="leading-relaxed">
                What the city has never had is a stage of its own: a place where a soil scientist,
                a market trader building a savings app and a poet can stand on the same red circle
                and be taken equally seriously.
              </p>
              <p className="leading-relaxed">
                TEDxLafia is that stage. It is not a conference, not a rally and not a networking
                event. It is one carefully built day of talks, performances and conversation,
                designed so that the ideas outlive the applause.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grid-bg grid-bg-ink bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading eyebrow="What we stand for" title="Four rules we don't bend" invert />
          <div className="mt-14 grid gap-px bg-ink-foreground/10 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="bg-ink p-8 lg:p-12">
                <p className="eyebrow text-primary">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 font-display text-3xl font-light">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-foreground/70">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="How we got here" title="Three years, one idea" />
          <ol className="mt-12 grid gap-px bg-border lg:grid-cols-3">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1} className="bg-background p-8 lg:p-10">
                <p className="font-display text-5xl font-light text-primary">{t.year}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <RegisterBanner />
    </>
  );
}
