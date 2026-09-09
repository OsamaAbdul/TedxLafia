import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SpeakerCard } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { RegisterBanner } from "@/components/site/RegisterBanner";
import { speakersQuery } from "@/lib/queries";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(speakersQuery),
  head: () => ({
    meta: [
      { title: "Speakers — TEDxLafia" },
      {
        name: "description",
        content:
          "Meet the TEDxLafia speakers: farmers, founders, physicians, poets and policy makers, each with one idea and eighteen minutes.",
      },
      { property: "og:title", content: "TEDxLafia Speakers" },
      {
        property: "og:description",
        content: "The people taking the red circle in Lafia this year.",
      },
    ],
  }),
  component: Speakers,
});

const STEPS = [
  { title: "Nominate", body: "Anyone can nominate — including yourself. Tell us the idea in three sentences, not the CV." },
  { title: "Conversation", body: "Our curation team calls shortlisted nominees to find the sharpest version of the idea." },
  { title: "Rehearsal", body: "Selected speakers get six weeks of coaching and three full rehearsals before stage day." },
];

function Speakers() {
  const { data: speakers } = useSuspenseQuery(speakersQuery);

  return (
    <>
      <PageHero
        eyebrow="Speakers"
        title={
          <>
            Eighteen minutes.
            <span className="block italic text-primary">One idea each.</span>
          </>
        }
        description="No panels, no keynotes for hire, no sales pitches. Every TEDxLafia speaker is chosen for a single idea they have tested in the real world — and then rehearsed until it lands."
      />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {speakers.length ? (
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {speakers.map((s, i) => (
                <SpeakerCard key={s.id} speaker={s} index={i} />
              ))}
            </div>
          ) : (
            <p className="font-display text-3xl font-light text-muted-foreground">
              This year's line-up is being finalised. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="grid-bg grid-bg-ink bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="Speak at TEDxLafia"
            title="Have an idea that keeps you up at night?"
            description="Nominations for the next edition are open year round. We read every single one."
            invert
          />
          <div className="mt-14 grid gap-px bg-ink-foreground/10 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="bg-ink p-8 lg:p-10">
                <p className="eyebrow text-primary">Step {i + 1}</p>
                <h3 className="mt-5 font-display text-3xl font-light">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-foreground/70">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-14">
            <Button asChild variant="editorial" size="editorial">
              <Link to="/contact">Nominate a speaker</Link>
            </Button>
          </div>
        </div>
      </section>

      <RegisterBanner />
    </>
  );
}
