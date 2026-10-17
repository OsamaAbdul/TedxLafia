import { ArrowUpRight } from "lucide-react";
import { TicketButton } from "./TicketButton";
import { Reveal } from "./Reveal";

export function RegisterBanner() {
  return (
    <section id="register" className="grid-bg grid-bg-ink bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-3 lg:px-10 lg:py-28">
        <Reveal className="lg:col-span-2">
          <p className="eyebrow opacity-80">Registration Closed • Capacity Reached</p>
          <h2 className="mt-5 font-display text-5xl leading-[0.98] font-light sm:text-6xl lg:text-7xl">
            All seats claimed for <span className="italic">TEDxLafia</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-85">
            Seats are limited by design — a TEDx event is a room, not a stadium. While delegate registration is now officially closed, you can join our priority waitlist or follow the global virtual stream.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="flex items-end lg:justify-end">
          <TicketButton variant="on-red" size="editorial">
            Tickets &amp; Waitlist <ArrowUpRight className="ml-1 h-4 w-4 inline-block" />
          </TicketButton>
        </Reveal>
      </div>
    </section>
  );
}
