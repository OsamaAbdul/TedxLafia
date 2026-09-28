import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
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



function Speakers() {
  const { data: speakers } = useSuspenseQuery(speakersQuery);
  const [activeYear, setActiveYear] = useState<"2025" | "2026">("2025");

  return (
    <>
      <section className="section-pad bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <h1 className="text-4xl font-display">Meet Our Speakers</h1>
          <p className="text-lg text-white/80 leading-relaxed text-center">Discover the thought leaders and innovators who will inspire, challenge, and engage you with their unique perspectives and ideas.</p>
        </div>
      </section>
      <section className="section-pad bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
            <h2 className="font-display text-5xl font-light text-white">{activeYear} Speakers</h2>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/20 self-start sm:self-auto">
              <button 
                onClick={() => setActiveYear("2025")} 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeYear === "2025" ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"}`}
              >
                2025
              </button>
              <button 
                onClick={() => setActiveYear("2026")} 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeYear === "2026" ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"}`}
              >
                2026
              </button>
            </div>
          </div>
          
          {activeYear === "2025" ? (
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {speakers2025.map((s, i) => (
                <SpeakerCard key={s.id} speaker={s as any} index={i} />
              ))}
              {speakers.map((s, i) => (
                <SpeakerCard key={s.id} speaker={s} index={i + speakers2025.length} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/20 rounded-3xl">
              <h3 className="text-3xl font-display text-white/50 mb-4">Coming Soon</h3>
              <p className="text-white/40 max-w-md">Our 2026 speaker lineup is currently being curated. Check back later for updates.</p>
            </div>
          )}
        </div>
      </section>



      <RegisterBanner />
    </>
  );
}
