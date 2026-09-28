import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

export function WhyJoinSection() {
  return (
    <section className="section-pad bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl mb-6">Why Join <span className="text-primary">TEDx</span>Lafia?</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Igniting your curiosity and inspire you to take action. Here, you will discover groundbreaking ideas, connect with passionate minds, and be empowered to create positive change in the world around you.
            </p>
            <Link
              to="/why-join-us"
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
            >
              Read the full story
            </Link>
          </Reveal>
          <Reveal delay={0.2} className="h-full">
            <img src="/teaM/team-3.jpeg" alt="Why Join Us" className="w-full h-full object-cover rounded-3xl aspect-[4/3] lg:aspect-auto" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
