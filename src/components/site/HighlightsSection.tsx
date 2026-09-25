import { Link } from "@tanstack/react-router";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function HighlightsSection() {
  const highlights = [
    {
      title: "TEDxLafia 2025: The Renaissance",
      description: "A deep dive into how technology and culture are reshaping the future of Nasarawa State.",
      image: "/highlight/IMG_1047.jpg",
      link: "/events",
    },
    {
      title: "Cultural Highlights",
      description: "Celebrating local heritage through art, music, and storytelling.",
      image: "/IMG_1131.jpg",
      link: "/events",
    },
    {
      title: "Storytelling Workshop",
      description: "Mastering the art of telling compelling stories that inspire change in our local communities.",
      image: "/landing-scroll.jpg",
      link: "/events",
    }
  ];

  return (
    <section className="section-pad bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Highlights"
          title="Past Events & Initiatives"
          description="Explore the ideas and stories that have shaped our community on the TEDxLafia stage."
          invert
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <Link
                to={item.link}
                className="group flex flex-col h-full border border-white/20 bg-black/20 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-editorial"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="flex flex-col flex-grow p-6 lg:p-8">
                  <h3 className="font-display text-2xl font-medium mb-3 text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/80 mb-6 flex-grow">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center text-sm font-medium text-white group-hover:text-primary">
                    <span className="link-hairline">View Event</span>
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/events"
            className="inline-flex h-12 items-center justify-center border border-white/30 bg-transparent px-8 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View More Events
          </Link>
        </div>
      </div>
    </section>
  );
}
