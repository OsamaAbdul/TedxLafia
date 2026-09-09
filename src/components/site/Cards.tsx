import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { EventRow, Partner, Speaker } from "@/lib/content.functions";
import { cn } from "@/lib/utils";
import { EASE, fadeUp } from "./Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export function SpeakerCard({ speaker, index = 0 }: { speaker: Speaker; index?: number }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      custom={index}
      className="group flex flex-col border-t border-foreground/80 pt-5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        {speaker.photo_url ? (
          <img
            src={speaker.photo_url}
            alt={speaker.name}
            loading="lazy"
            width={640}
            height={800}
            className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="font-display text-7xl font-light text-ink-foreground/80">
              {initials(speaker.name)}
            </span>
          </div>
        )}
        <span className="absolute top-0 left-0 h-1.5 w-12 bg-primary transition-all duration-500 group-hover:w-full" />
      </div>
      <p className="eyebrow mt-6 text-primary">Speaker {String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-3 font-display text-3xl leading-none font-light">{speaker.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{speaker.title}</p>
      {speaker.talk_title && (
        <p className="mt-4 border-l-2 border-primary pl-3 text-sm leading-relaxed italic">
          “{speaker.talk_title}”
        </p>
      )}
    </motion.article>
  );
}

export function PartnerTile({ partner, index = 0 }: { partner: Partner; index?: number }) {
  const Inner = (
    <>
      {partner.logo_url ? (
        <img
          src={partner.logo_url}
          alt={partner.name}
          loading="lazy"
          width={240}
          height={96}
          className="max-h-12 w-auto opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span className="font-display text-2xl font-light tracking-tight transition-colors group-hover:text-primary">
          {partner.name}
        </span>
      )}
      <span className="eyebrow absolute top-4 left-4 text-muted-foreground">{partner.tier}</span>
      {partner.website_url && (
        <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </>
  );
  const cls =
    "group relative grid min-h-40 place-items-center border border-border bg-background p-8 text-center transition-colors hover:border-primary";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      custom={index}
    >
      {partner.website_url ? (
        <a href={partner.website_url} target="_blank" rel="noreferrer" className={cls}>
          {Inner}
        </a>
      ) : (
        <div className={cls}>{Inner}</div>
      )}
    </motion.div>
  );
}

export function EventCard({
  event,
  featured,
  className,
}: {
  event: EventRow;
  featured?: boolean;
  className?: string;
}) {
  const date = new Date(event.starts_at);
  const past = date.getTime() < Date.now();
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className={cn(
        "relative grid gap-8 border p-8 lg:p-12",
        featured
          ? "border-primary bg-ink text-ink-foreground shadow-red lg:grid-cols-[1fr_2fr]"
          : "border-border bg-background lg:grid-cols-[1fr_2fr]",
        className,
      )}
    >
      <div>
        <p className={cn("eyebrow", featured ? "text-primary" : "text-muted-foreground")}>
          {past ? "Past edition" : featured ? "Next edition" : "Upcoming"}
        </p>
        <p className="mt-4 font-display text-6xl leading-none font-light lg:text-8xl">
          {format(date, "dd")}
        </p>
        <p className="mt-2 font-display text-2xl font-light">{format(date, "MMMM yyyy")}</p>
      </div>
      <div className="flex flex-col">
        <h3 className="font-display text-3xl leading-tight font-light lg:text-5xl">
          {event.title}
          {event.theme && (
            <span className={cn("block italic", featured ? "text-primary" : "text-primary")}>
              {event.theme}
            </span>
          )}
        </h3>
        <p
          className={cn(
            "mt-5 max-w-xl leading-relaxed",
            featured ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {event.description}
        </p>
        <dl
          className={cn(
            "mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm",
            featured ? "text-ink-foreground/80" : "text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
            <dt className="sr-only">Time</dt>
            <dd>{format(date, "EEEE, h:mm a")}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            <dt className="sr-only">Venue</dt>
            <dd>{event.venue}</dd>
          </div>
        </dl>
        {event.ticket_url && !past && (
          <div className="mt-8">
            <Button asChild variant={featured ? "editorial" : "outline-ink"} size="editorial">
              <a href={event.ticket_url} target="_blank" rel="noreferrer">
                Register now
              </a>
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
