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

const SCHEDULE = [
  { time: "09:00", title: "Doors and coffee", note: "Registration, name badges, first conversations." },
  { time: "10:00", title: "Session one — Ground", note: "Three talks on land, food and the work of feeding a state." },
  { time: "11:30", title: "Interval", note: "Refreshments and a live performance." },
  { time: "12:15", title: "Session two — Build", note: "Three talks on health, technology and small enterprise." },
  { time: "13:45", title: "Lunch", note: "Long tables, mixed seating, deliberately." },
  { time: "15:00", title: "Session three — Voice", note: "Two closing talks and a poem." },
  { time: "16:30", title: "Close", note: "Photos on the red circle, then the after-conversation." },
];

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
          <>
            Where and when
            <span className="block italic text-primary">we gather.</span>
          </>
        }
        description="One flagship edition each year, plus smaller salons where a single question gets a whole evening. Every gathering is ticketed, seated and deliberately small."
      />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow={upcoming.length ? "Coming up" : "Programme"}
            title={upcoming.length ? "Next on the calendar" : "Nothing scheduled just yet"}
            description={
              upcoming.length
                ? "Registration opens to our newsletter subscribers first, then to the public while seats last."
                : "Join the newsletter and you'll hear about the next edition before anyone else."
            }
          />
          <div className="mt-12 grid gap-8">
            {upcoming.map((e, i) => (
              <EventCard key={e.id} event={e} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid-bg grid-bg-ink bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="A day at TEDxLafia"
            title="The shape of the programme"
            description="Times are indicative — the running order is confirmed a fortnight before each edition."
            invert
          />
          <ol className="mt-14 border-t border-ink-foreground/15">
            {SCHEDULE.map((s, i) => (
              <Reveal
                key={s.time}
                delay={i * 0.05}
                className="grid gap-2 border-b border-ink-foreground/15 py-6 sm:grid-cols-[7rem_1fr_1fr] sm:items-baseline sm:gap-8"
              >
                <p className="eyebrow text-primary">{s.time}</p>
                <h3 className="font-display text-2xl font-light">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ink-foreground/60">{s.note}</p>
              </Reveal>
            ))}
          </ol>
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
