import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { RegisterBanner } from "@/components/site/RegisterBanner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TEDxLafia — Ideas Worth Spreading in Nasarawa" },
      {
        name: "description",
        content:
          "TEDxLafia is a volunteer-run, independently organized TED event in Lafia, Nasarawa State, built to put local ideas on a global stage.",
      },
      { property: "og:title", content: "About TEDxLafia" },
      {
        property: "og:description",
        content: "Who we are, why Lafia, and how a TEDx event actually works.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Ideas worth
            <span className="block italic text-primary">spreading.</span>
          </>
        }
        description="Learn more about TED, TEDx, and the vision behind TEDxLafia."
        bgImage="/IMG_1131.jpg"
      />

      {/* Dark background section with the adapted content */}
      <section className="section-pad bg-ink text-ink-foreground">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 space-y-20">
          
          <Reveal>
            <h2 className="font-display text-4xl mb-6 text-primary">About TEDxLafia</h2>
            <div className="space-y-6 text-lg leading-relaxed text-ink-foreground/80">
              <p>
                TEDxLafia is an independently organized TED event to be held in Lafia, Nasarawa State. It is one of its kind that will bring together some of the brightest thinkers and doers from around Nigeria and the rest of the world to gather, connect and establish collaboration to develop a blueprint on how to make great ideas have big impacts in areas of governance, business, education, health, economy entrepreneurship and innovation among others. TEDxLafia would mark out the pathway to co-create and generate ideas. Ambition alone is not enough to bring about the kind of impact we want to see in our society. Together, we must convert ambition into practical ideas that would generate the right positive impacts in our society.
              </p>
              <p>
                Just like other TEDx Talks, TEDxLafia looks to inspire the community through the power of IDEAS WORTH SPREADING. Our event is much more than just a gathering; it is a catalyst for intellectual exploration and creative collaboration. You will be exposed to a wide range of ideas, from science and technology to art and philosophy. These ideas will challenge your assumptions, broaden your horizons, and inspire you to think differently.
              </p>
              <p>
                Our desired outcome is that TEDxLafia will be the birth of great ideas that would make significant impacts in people's lives and society. Our event seeks to bring people of all ages, gender, tribes, religions, and political ideology to come together and co-create solutions through the generation of ideas that will improve our communities.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl mb-6 text-primary">About TEDx</h2>
            <div className="space-y-6 text-lg leading-relaxed text-ink-foreground/80">
              <p>
                In the spirit of ideas worth spreading, TEDx is a program of local, self-organised events that bring people together to share a TED-like experience.
              </p>
              <p>
                At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organised events are branded TEDx, where x = independently organised TED event. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organised. (Subject to certain rules and regulations.)
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="font-display text-4xl mb-6 text-primary">About TED</h2>
            <div className="space-y-6 text-lg leading-relaxed text-ink-foreground/80">
              <p>
                TED is a global community, welcoming people from every discipline and culture who seek a deeper understanding of the world. We believe passionately in the power of ideas to change attitudes, lives and, ultimately, the world.
              </p>
              <p>
                TED began in 1984 as a conference where Technology, Entertainment and Design converged, and today covers almost all topics from science to business to global issues, in more than 100 languages. Meanwhile, independently run TEDx events help share ideas in communities around the world.
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      <RegisterBanner />
    </>
  );
}
