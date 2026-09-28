import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { RegisterBanner } from "@/components/site/RegisterBanner";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — TEDxLafia" },
      { name: "description", content: "Meet the passionate individuals bringing TEDxLafia to life." }
    ]
  }),
  component: TeamPage
});

const CORE_TEAM = [
  { name: "Curator Name", role: "Curator", bio: "Leading the vision and curation of TEDxLafia." },
  { name: "Co-Organizer Name", role: "Co-Organizer", bio: "Handling logistics, planning, and execution." },
  { name: "Design Lead Name", role: "Design Lead", bio: "Creating the visual identity and experience." },
];

function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title=""
        bgImages={[{ url: "/teaM/team-4.jpeg", position: "center 25%", size: "contain" }]}
        className="min-h-[400px] lg:min-h-[500px] flex flex-col justify-center"
      />

      <section className="section-pad bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-6 sm:mb-8">
            <div className="max-w-2xl">
              <Reveal>
                <h2 className="font-display text-4xl sm:text-5xl mb-6">Our Team</h2>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Our team is made up of passionate and dedicated young people from diverse backgrounds and professional fields. From lawyers and software engineers to creatives, entrepreneurs, researchers, and community development enthusiasts, we bring together different skills, perspectives, and experiences.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  United by a shared commitment to creating meaningful ideas and positive change, our team works collaboratively to bring TEDxLafia to life. Together, we contribute our time, talents, and energy to build an engaging platform that inspires conversations, celebrates ideas, and creates impact within our community and beyond.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Reveal delay={0.1} className="h-full">
                <img src="/teaM/team-1.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full aspect-[3/4]" />
              </Reveal>
              <div className="grid grid-rows-2 gap-4 sm:gap-6 h-full">
                <Reveal delay={0.2} className="h-full">
                  <img src="/teaM/team-2.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full" />
                </Reveal>
                <Reveal delay={0.3} className="h-full">
                  <img src="/teaM/team-3.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full" />
                </Reveal>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-24">
            <Reveal delay={0.4} className="h-full">
              <img src="/teaM/team-5.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full aspect-square" />
            </Reveal>
            <Reveal delay={0.5} className="h-full">
              <img src="/teaM/team-6.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full aspect-square" />
            </Reveal>
            <Reveal delay={0.6} className="h-full">
              <img src="/teaM/team-7.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full aspect-square" />
            </Reveal>
            <Reveal delay={0.7} className="h-full">
              <img src="/teaM/team-8.jpeg" alt="Team member" className="rounded-3xl object-cover w-full h-full aspect-square" />
            </Reveal>
          </div>


        </div>
      </section>

    </>
  );
}
