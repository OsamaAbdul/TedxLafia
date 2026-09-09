import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PartnerTile } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { partnersQuery } from "@/lib/queries";

export const Route = createFileRoute("/partners")({
  loader: ({ context }) => context.queryClient.ensureQueryData(partnersQuery),
  head: () => ({
    meta: [
      { title: "Partners — TEDxLafia" },
      {
        name: "description",
        content:
          "Partner with TEDxLafia: support an independently organized TED event in Nasarawa State and put your name behind local ideas.",
      },
      { property: "og:title", content: "Partner with TEDxLafia" },
      {
        property: "og:description",
        content: "Tiers, what partnership covers, and how to start the conversation.",
      },
    ],
  }),
  component: Partners,
});

const TIERS = [
  {
    name: "Headline",
    price: "₦2,500,000",
    items: [
      "Name alongside the event across all editions materials",
      "Eight guest seats and a reserved table at lunch",
      "Logo on the stage backdrop and all talk videos",
      "A short welcome from your team on the day",
    ],
  },
  {
    name: "Supporting",
    price: "₦1,000,000",
    items: [
      "Logo on the website, programme and talk end-cards",
      "Four guest seats",
      "Named sponsorship of one session",
      "Access to event photography and footage",
    ],
  },
  {
    name: "Community",
    price: "In kind",
    items: [
      "Venue, catering, printing, sound, transport or hospitality",
      "Two guest seats",
      "Listed as a community partner across the site",
      "Best route for local businesses and NGOs",
    ],
  },
];

function Partners() {
  const { data: partners } = useSuspenseQuery(partnersQuery);

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={
          <>
            Back the ideas
            <span className="block italic text-primary">before they're obvious.</span>
          </>
        }
        description="TEDxLafia is non-profit and volunteer-run. Every naira and every donated chair goes into the room, the recording and the free publication of the talks afterwards."
      />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="In good company" title="Organisations making this possible" />
          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p, i) => (
              <PartnerTile key={p.id} partner={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid-bg grid-bg-ink bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="Partnership"
            title="Three ways to stand behind it"
            description="TED rules keep our stage free of sales pitches — partnership buys presence and goodwill, never a slot in the programme. We think that's exactly why it works."
            invert
          />
          <div className="mt-14 grid gap-px bg-ink-foreground/10 lg:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08} className="flex flex-col bg-ink p-8 lg:p-10">
                <p className="eyebrow text-primary">{t.name}</p>
                <p className="mt-5 font-display text-4xl font-light">{t.price}</p>
                <ul className="mt-8 grid gap-3 text-sm leading-relaxed text-ink-foreground/70">
                  {t.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mark-red mt-1.5 shrink-0" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <div className="mt-14">
            <Button asChild variant="editorial" size="editorial">
              <Link to="/contact">Start a conversation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
