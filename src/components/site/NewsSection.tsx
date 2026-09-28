import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

export function NewsSection() {
  const newsItems = [
    {
      id: 1,
      image: "/teaM/team-1.jpeg",
      date: "2025",
      title: "Meet the Faces Behind TEDxLafia.",
      excerpt: "Get to know the passionate organizing committee working tirelessly behind the scenes to bring this event to life."
    },
    {
      id: 2,
      image: "/teaM/team-2.jpeg",
      date: "2025",
      title: "TEDxLafia Volunteer Drive Success.",
      excerpt: "A massive thank you to everyone who showed up! Our community is growing stronger every single day."
    },
    {
      id: 3,
      image: "/teaM/team-7.jpeg",
      date: "2026",
      title: "Behind the Scenes Preparation.",
      excerpt: "From stage design to speaker curation, here is an exclusive sneak peek into our journey to the big day."
    }
  ];

  return (
    <section className="section-pad bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center mb-16">
            <p className="eyebrow text-primary mb-4">Our Blogs</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold">Our Recent News</h2>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((news, i) => (
            <Reveal key={news.id} delay={i * 0.1}>
              <Link to="/" className="group block cursor-pointer">
                <div className="overflow-hidden rounded-xl mb-6 aspect-[4/3] bg-white/5">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 mb-4 rounded-sm">
                  {news.date}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                  {news.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {news.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
