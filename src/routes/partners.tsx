import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PartnerTile } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/partners")({
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
        content: "Our main partners and sponsors, and how to start the conversation.",
      },
    ],
  }),
  component: Partners,
});

const HARDCODED_PARTNERS = [
  { id: "1", name: "Dan Sarki", logo_url: "/partners/dansarki.jpg" },
  { id: "2", name: "MSD Designs", logo_url: "/partners/msddesigns.jpg" },
  { id: "3", name: "O2 Inn", logo_url: "/partners/o2inn.png" },
] as any[];

function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners and Sponsors"
        title={
          <>
            Our Main Partners <br />
            <span className="italic text-primary">and Sponsors</span>
          </>
        }
        description="The organising team is delighted to be working with the following local businesses and organisations on the delivery of TEDxLafia."
        bgImages={[
          "/partners/_KAS3371.jpg",
          { url: "/partners/_KAS3168.jpg", position: "center 20%" }
        ]}
      />

      <section className="section-pad bg-ink text-ink-foreground">
        <div className="background-dark mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="In good company" title="Organisations making this possible" invert />
          <div className="mt-12 px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {HARDCODED_PARTNERS.map((p, i) => (
                  <CarouselItem key={p.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                      <PartnerTile partner={p} index={i} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-background text-foreground hover:bg-primary hover:text-primary-foreground -left-4 lg:-left-12" />
              <CarouselNext className="bg-background text-foreground hover:bg-primary hover:text-primary-foreground -right-4 lg:-right-12" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="grid-bg grid-bg-ink bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="Call For Sponsorship"
            title="Sponsor TEDxLafia"
            description="By sponsoring TEDxLafia, your brand is having the opportunity to be associated with the most unique event in Nasarawa state. It also gives your brand the leverage of breaking into the untapped market of Nasarawa State. Other benefits also include having your logo on the videos to be uploaded on the official TEDx YouTube Channel giving your brand exposure to over 30 million individuals in all countries of the world."
            invert
          />

          <div className="mt-14 max-w-4xl space-y-8 text-lg leading-relaxed text-ink-foreground/80">
            <Reveal delay={0.1}>
              <p>
                The huge Networking opportunity at the event would also be an explosive opportunity for your brand. The audience would comprise of the young millennials, rural farmers, captains of industries, government officials from state to federal, politicians, military and para-military, etc.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                Aside from the individual brand exposure and benefits, you are helping bridge the gap in society, helping shape a better community and humanity.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p>
                The more your brand name is associated with positive experience the stronger your brand awareness will be.
              </p>
            </Reveal>
          </div>

          <div className="mt-16">
            <Reveal delay={0.4}>
              <p className="mb-6 font-display text-2xl font-light text-ink-foreground">
                Would you like to support the event through partnership or sponsorship?
              </p>
              <Button asChild variant="editorial" size="editorial">
                <a href="mailto:TedxLafia@gmail.com">Email TedxLafia@gmail.com</a>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
