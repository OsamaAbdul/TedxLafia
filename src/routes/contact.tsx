import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Get in <span className="block italic text-primary">touch.</span>
          </>
        }
        description="Whether you want to speak, partner with us, or just ask a question, we'd love to hear from you."
      />
      <section className="section-pad">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
