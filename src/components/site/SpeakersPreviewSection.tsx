import { useState } from "react";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";
import { SpeakerCard } from "./Cards";
import speakers2025 from "@/data/speakers.json";

export function SpeakersPreviewSection() {
  const [speakerYear, setSpeakerYear] = useState<"2025" | "2026">("2025");

  return (
    <section className="section-pad bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-white/20 pb-8">
            <div className="max-w-2xl">
              <p className="eyebrow text-white/50 mb-4">Visionaries</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <h2 className="font-display text-4xl sm:text-5xl">Meet Our Speakers</h2>
                <div className="flex bg-white/10 rounded-full p-1 border border-white/20 self-start">
                  <button
                    onClick={() => setSpeakerYear("2025")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${speakerYear === "2025" ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"}`}
                  >
                    2025
                  </button>
                  <button
                    onClick={() => setSpeakerYear("2026")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${speakerYear === "2026" ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"}`}
                  >
                    2026
                  </button>
                </div>
              </div>
            </div>
            <Link
              to="/speakers"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shrink-0"
            >
              Discover More
            </Link>
          </div>
        </Reveal>

        {speakerYear === "2025" ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {speakers2025.slice(0, 3).map((s, i) => (
              <SpeakerCard key={s.id} speaker={s as any} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/20 rounded-3xl">
            <h3 className="text-3xl font-display text-white/50 mb-4">Coming Soon</h3>
            <p className="text-white/40 max-w-md">Our 2026 speaker lineup is currently being curated.</p>
          </div>
        )}
      </div>
    </section>
  );
}
