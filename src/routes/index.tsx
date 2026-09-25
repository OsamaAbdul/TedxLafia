import { createFileRoute, Link } from "@tanstack/react-router";
import { ShaderBackground } from "@/components/ui/waves-shader";
import { PageHero } from "@/components/site/PageHero";
import { RegisterBanner } from "@/components/site/RegisterBanner";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { NAV } from "@/lib/site";
import { PartnerLogos } from "@/components/site/PartnerLogos";
import { HighlightsSection } from "@/components/site/HighlightsSection";
import { StatsSection } from "@/components/site/StatsSection";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="The Future is Now"
        title={
          <>
            <span className="text-primary text-5xl md:text-6xl">TEDx</span>Lafia
          </>
        }
        description="Welcome to TEDxLafia. An independently organized TED event in Lafia, Nasarawa State, bringing together thinkers, builders and storytellers."
        bgImage="/IMG_0943.jpg"
        aside={
          <img
            src="/small-boy.png"
            alt="TEDxLafia Community"
            className="w-full max-w-sm mx-auto object-contain drop-shadow-2xl -mb-16 lg:-mb-24"
          />
        }
        bottomOverlay={
          <div 
            className="absolute inset-x-0 -bottom-32 h-[32rem] w-full pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)"
            }}
          >
            <ShaderBackground className="absolute inset-0 opacity-90" />
          </div>
        }
      >
        <Link
          to="/"
          className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Get Ticket
        </Link>
        <Link
          to="/partners"
          className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Get Involved
        </Link>
      </PageHero>



      <div className="relative" style={{ clipPath: "inset(0)" }}>
        {/* Sticky background image for flawless parallax across all devices */}
        <div className="sticky top-0 w-full h-0">
          <div className="absolute top-0 left-0 w-full h-[100dvh] overflow-hidden -z-10">
            <div className="absolute inset-0 bg-[url('/landing-scroll.jpg')] bg-cover bg-center blur-[2px] scale-105 brightness-50" />
          </div>
        </div>

        <div className="relative z-10 dark text-foreground pt-32">
          {/* Smooth gradient at the top to blend from the hero section */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent" />
          <HighlightsSection />
          <StatsSection />
        </div>
      </div>
      <PartnerLogos />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Explore"
            title="Discover TEDxLafia"
            description="Our platform exists because our city is full of people solving real problems. We are creating a stage for the ideas already here."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NAV.map((item, i) => {
              const to = item.to || item.children?.[0]?.to;
              if (!to) return null;

              return (
                <Reveal key={item.label} delay={i * 0.1}>
                  <Link
                    to={to}
                    className="group flex flex-col justify-between border border-border bg-background p-8 transition-colors hover:border-primary hover:bg-ink hover:text-ink-foreground h-40"
                  >
                    <span className="font-display text-3xl font-light">{item.label}</span>
                    <span className="eyebrow text-muted-foreground group-hover:text-primary">
                      Explore &rarr;
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <RegisterBanner />
    </>
  );
}


