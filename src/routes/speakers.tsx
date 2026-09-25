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
import speakers2025 from "@/data/speakers.json";

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
          <h2 className="mb-10 font-display text-5xl font-light text-foreground">2025 Speakers</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {speakers2025.map((s, i) => (
              <SpeakerCard key={s.id} speaker={s as any} index={i} />
            ))}
            {speakers.map((s, i) => (
              <SpeakerCard key={s.id} speaker={s} index={i + speakers2025.length} />
            ))}
          </div>
        </div>
      </section>



      <RegisterBanner />
    </>
  );
}
