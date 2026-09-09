import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";

export function RegisterBanner() {
  return (
    <section id="register" className="grid-bg grid-bg-ink bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-3 lg:px-10 lg:py-28">
        <Reveal className="lg:col-span-2">
          <p className="eyebrow opacity-80">Register</p>
          <h2 className="mt-5 font-display text-5xl leading-[0.98] font-light sm:text-6xl lg:text-7xl">
            Take your seat at <span className="italic">TEDxLafia</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-85">
            Seats are limited by design — a TEDx event is a room, not a stadium. Registration
            opens to our newsletter first.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="flex items-end lg:justify-end">
          <Button asChild variant="on-red" size="editorial">
            <a href={SITE.registerUrl} target="_blank" rel="noreferrer">
              Register now <ArrowUpRight />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
