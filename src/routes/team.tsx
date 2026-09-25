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
        title={
          <>
            The people behind <br/>
            <span className="italic text-primary">the ideas.</span>
          </>
        }
        description="TEDxLafia is made possible by an incredible group of dedicated volunteers, thinkers, and builders who are passionate about putting our local ideas on a global stage."
      />

      <section className="section-pad bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Core Team" title="Organizers & Curators" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="flex flex-col gap-4 border border-border p-6 rounded-3xl h-full hover:border-primary transition-colors bg-ink/5">
                  <div className="w-full aspect-square rounded-2xl bg-ink/10 flex items-center justify-center text-muted-foreground overflow-hidden">
                    <span className="text-4xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl">{member.name}</h3>
                    <p className="eyebrow text-primary mt-1">{member.role}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RegisterBanner />
    </>
  );
}
