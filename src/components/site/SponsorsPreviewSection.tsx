import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

const SPONSORS_PREVIEW = [
  { id: 1, name: "Adogi", image: "/sponsors/Adogi.png" },
  { id: 2, name: "Captain", image: "/sponsors/Captain.png" },
  { id: 3, name: "Headline", image: "/sponsors/Munira.png" },
  { id: 4, name: "State", image: "/sponsors/State.png" },
];

export function SponsorsPreviewSection() {
  return (
    <section className="section-pad bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8 pb-8 border-b border-white/20">
            <div className="max-w-2xl">
              <p className="eyebrow text-primary mb-4">Our Partners</p>
              <h2 className="font-display text-4xl sm:text-5xl">Our Sponsors</h2>
              <p className="mt-4 text-white/60 text-lg">
                Empowering ideas that matter. Meet the incredible partners who make TEDxLafia possible.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 shrink-0">
              <img 
                src="/sponsors/General.png" 
                alt="General Sponsor" 
                className="w-48 sm:w-64 object-contain drop-shadow-2xl rounded-2xl" 
              />
              <Link
                to="/sponsors"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shrink-0"
              >
                View More
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {SPONSORS_PREVIEW.map((sponsor, i) => (
            <Reveal key={sponsor.id} delay={i * 0.1}>
              <div className="group w-full aspect-square bg-white/5 rounded-3xl p-6 flex items-center justify-center border border-white/10 transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:scale-105 shadow-xl">
                <img
                  src={sponsor.image}
                  alt={`${sponsor.name}`}
                  className="w-full h-full object-cover rounded-xl filter opacity-80 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
