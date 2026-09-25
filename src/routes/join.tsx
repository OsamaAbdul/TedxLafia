import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { RegisterBanner } from "@/components/site/RegisterBanner";
import { ContactForm } from "@/components/site/ContactForm";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/join")({
  component: JoinPage,
});

function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Us"
        title={
          <>
            Be part of <span className="block italic text-primary">the team.</span>
          </>
        }
        description="TEDxLafia is entirely volunteer-run. We are always looking for passionate people to help us build a stage for the best ideas in Nasarawa."
      />
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Volunteer"
            title="Help us build the next edition"
            description="Send us a message using the form below and let us know how you'd like to contribute."
          />
          <div className="mt-12 max-w-3xl">
            <ContactForm defaultSubject="Volunteering" />
          </div>
        </div>
      </section>
      <RegisterBanner />
    </>
  );
}
