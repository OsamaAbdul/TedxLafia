import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { EventCard } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { RegisterBanner } from "@/components/site/RegisterBanner";
import { eventsQuery } from "@/lib/queries";

export const Route = createFileRoute("/events")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  head: () => ({
    meta: [
      { title: "Events — TEDxLafia" },
      {
        name: "description",
        content:
          "Dates, venues and programme for TEDxLafia editions, salons and community sessions in Lafia, Nasarawa State.",
      },
      { property: "og:title", content: "TEDxLafia Events" },
      {
        property: "og:description",
        content: "The next edition, plus salons and past gatherings in Lafia.",
      },
    ],
  }),
  component: Events,
});


function Events() {
  const { data: events } = useSuspenseQuery(eventsQuery);
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = events.filter((e) => new Date(e.starts_at).getTime() < now);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={
          <div className="text-4xl sm:text-5xl lg:text-6xl">
            Where and when
            <span className="block italic text-primary">we gather.</span>
          </div>
        }
        bgImages={["/teaM/team-2.jpeg"]}
      />




      <section className="section-pad bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl mb-8 text-center">Our Maiden Event</h2>
            <div className="space-y-6 text-lg text-white/80 leading-relaxed text-center">
              <p>
                TEDxLafia held its maiden event on 10 December 2025 under the theme “The Future Is Now.” The event brought together inspiring speakers, young innovators, professionals, creatives, and community leaders for a day of thought-provoking ideas, meaningful conversations, and connections.
              </p>
              <p>
                As the first TEDx event in Nasarawa State, TEDxLafia created a platform for ideas worth spreading, highlighting stories and perspectives capable of inspiring positive change within our community and beyond. The event marked the beginning of our journey to build a lasting culture of ideas, innovation, and impact in Nasarawa State.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {past.length > 0 && (
        <section className="section-pad">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading eyebrow="Archive" title="Where we've been" />
            <div className="mt-12 grid gap-8">
              {past.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      <RegisterBanner />
    </>
  );
}
