import { Link } from "@tanstack/react-router";
import {
  Ticket,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  Download,
  Sparkles,
  Video,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";

export function ClosedTicketView() {
  // Calendar Event .ics Generator
  const downloadCalendarFile = () => {
    const eventTitle = "TEDxLafia 2026: The Future Is Now";
    const description =
      "TEDxLafia 2026 - Independently organized TED event featuring groundbreaking ideas, innovator talks, and live community discourse in Lafia, Nasarawa State.";
    const location =
      "Abdullahi Sule Investment Centre (NASIDA), Muhammadu Buhari Way, Lafia, Nasarawa State, Nigeria";
    const startDate = "20261107T080000Z";
    const endDate = "20261107T170000Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TEDxLafia//Attendee Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      "STATUS:CONFIRMED",
      "URL:https://tedxlafia.com",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TEDxLafia-2026.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Event added to your calendar!");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Background Aesthetic Subtle Lights & Grid Lines */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[130px] rounded-full" />
        <div className="absolute top-10 right-10 w-[350px] h-[250px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Hero: Registration Closed Notice */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="eyebrow text-xs font-semibold text-primary tracking-widest">
              Registration Officially Closed • Capacity Reached
            </span>
          </div>

          <Reveal>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light text-foreground leading-[1.05]">
              The Room is Full. <br />
              <span className="italic text-primary font-normal">The Ideas Are Limitless.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Thank you for the extraordinary enthusiasm! All in-person attendee seats and delegate
              passes for <strong className="text-foreground font-semibold">TEDxLafia 2026</strong> have
              been officially claimed. In accordance with TED regulations for intimate local dialogue,
              venue capacity is strictly capped.
            </p>
          </Reveal>

          {/* Quick Metrics Bar */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 text-left">
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary text-xs font-medium uppercase tracking-wider">
                  <Users className="h-4 w-4" /> Capacity
                </div>
                <div className="mt-2 text-2xl font-display font-light text-foreground">70 / 70</div>
                <div className="text-[11px] text-muted-foreground">100% Seats Reserved</div>
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-rose-500 text-xs font-medium uppercase tracking-wider">
                  <Ticket className="h-4 w-4" /> Ticket Status
                </div>
                <div className="mt-2 text-2xl font-display font-light text-foreground">Sold Out</div>
                <div className="text-[11px] text-muted-foreground">Registration Closed</div>
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary text-xs font-medium uppercase tracking-wider">
                  <Calendar className="h-4 w-4" /> Event Date
                </div>
                <div className="mt-2 text-2xl font-display font-light text-foreground">Nov 7, 2026</div>
                <div className="text-[11px] text-muted-foreground">08:30 AM Prompt</div>
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary text-xs font-medium uppercase tracking-wider">
                  <MapPin className="h-4 w-4" /> Location
                </div>
                <div className="mt-2 text-xl font-display font-light text-foreground truncate">NASIDA Centre</div>
                <div className="text-[11px] text-muted-foreground truncate">Lafia, Nasarawa</div>
              </div>
            </div>
          </Reveal>

          {/* Action Buttons */}
          <Reveal delay={0.2}>
            <div className="pt-6 flex flex-wrap gap-4 justify-center">
              <Button asChild variant="editorial" size="editorial">
                <Link to="/speakers">
                  Meet the Speakers <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="editorial">
                <Link to="/about">About TEDxLafia</Link>
              </Button>
              <Button asChild variant="outline" size="editorial">
                <Link to="/contact">Contact Organizing Team</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Global Broadcast & Digital Stream Section */}
        <div className="mt-20 max-w-4xl mx-auto space-y-8">
          <div>
            <span className="eyebrow flex items-center gap-2 text-primary">
              <Video className="h-3.5 w-3.5" />
              Digital Experience
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground font-light mt-1">
              Experience TEDxLafia From Anywhere
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Ideas belong to everyone. Even if you won’t be in the room physically, you can
              still immerse yourself in every talk, live commentary, and discussion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Livestream Card */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-foreground">Official Livestream</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                HD live broadcast on event day across YouTube and our official channels,
                featuring live keynote speeches and discussions.
              </p>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 pt-2"
              >
                Subscribe on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* TEDx Talks Archive */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-foreground">Official TEDx Archive</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every talk is recorded in 4K resolution and published on the global TEDx YouTube
                channel (40M+ subscribers) post-event.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 pt-2"
              >
                Browse Past Gatherings <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Calendar Reminder */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-foreground">Calendar Notification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save Saturday, Nov 7, 2026 to your phone or desktop calendar so you never miss
                the opening keynote.
              </p>
              <button
                type="button"
                onClick={downloadCalendarFile}
                className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 pt-2 cursor-pointer"
              >
                Download .ICS Calendar Pass <Download className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Social Community Callout */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-display text-lg text-foreground">Follow the Live Coverage</p>
              <p className="text-xs text-muted-foreground">
                Use hashtag <strong className="text-primary">#TEDxLafia2026</strong> and follow us
                for real-time quotes, clips, and highlights.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={SITE.social.x} target="_blank" rel="noreferrer">
                  X / Twitter
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={SITE.social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={SITE.social.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Speakers Teaser */}
        <div className="mt-24 pt-12 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow text-primary">The Voices Taking the Stage</p>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-foreground mt-2">
                Meet the TEDxLafia 2026 Speakers
              </h2>
            </div>
            <Button asChild variant="editorial" size="editorial">
              <Link to="/speakers">
                Explore Full Speaker Profiles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src="/Speakers/IMG-20260924-WA0025.jpg"
                  alt="Rahmatu Abdulkarim Iyimoga"
                  className="h-16 w-16 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <h4 className="font-display text-lg text-foreground font-medium">
                    Rahmatu Abdulkarim Iyimoga
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Founder, Nasarawa Youth Think Tank
                  </p>
                </div>
              </div>
              <p className="text-xs text-foreground/80 italic border-l-2 border-primary/50 pl-3">
                “Why Public Health is everybody’s Business, not just the government’s.”
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src="/Speakers/IMG-20260924-WA0026.jpg"
                  alt="Auwal M.S"
                  className="h-16 w-16 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <h4 className="font-display text-lg text-foreground font-medium">Auwal M.S</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Head of DevRel, Moniepoint Group
                  </p>
                </div>
              </div>
              <p className="text-xs text-foreground/80 italic border-l-2 border-primary/50 pl-3">
                “Skills and the Future of Work.”
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src="/Speakers/waziri.jpeg"
                  alt="Ummi Yahuza Waziri"
                  className="h-16 w-16 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <h4 className="font-display text-lg text-foreground font-medium">
                    Ummi Yahuza Waziri
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Executive Director, Echoes Of Change
                  </p>
                </div>
              </div>
              <p className="text-xs text-foreground/80 italic border-l-2 border-primary/50 pl-3">
                “From Awareness To Lifestyle: Creating Climate-Conscious communities.”
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-24 pt-12 border-t border-border max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="eyebrow text-primary">Need Clarification?</span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Answers regarding ticket access, event admissions, virtual access, and partnerships.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="door-tickets" className="rounded-2xl border border-border bg-card px-6 py-2">
              <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                Can I purchase or register for a ticket at the venue on event day?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                <strong>No.</strong> In strict compliance with TED global licensing and venue safety
                regulations, our room capacity is strictly limited to pre-registered ticket holders.
                No tickets will be sold or issued at the entrance on event day. Only confirmed
                delegates holding a valid digital pass and government/student ID will be admitted.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ticket-transfer" className="rounded-2xl border border-border bg-card px-6 py-2">
              <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                Can I transfer my registered ticket to a friend or colleague?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                Tickets are non-transferable without direct organizer approval. If you can no longer
                attend, please email us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary underline">
                  {SITE.email}
                </a>{" "}
                so we can reallocate your seat.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="online-watch" className="rounded-2xl border border-border bg-card px-6 py-2">
              <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                Where will the talks be published after the event?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                Every talk delivered at TEDxLafia is recorded with broadcast-grade equipment and
                submitted to TED Conferences for official publication on the global TEDx YouTube
                channel. You will be able to watch, re-listen, and share the high-definition talks
                worldwide free of charge.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="partnership" className="rounded-2xl border border-border bg-card px-6 py-2">
              <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                Can my organization still partner with or support TEDxLafia?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                Yes! We welcome forward-thinking organizations, brands, and philanthropists aligned
                with our mission to spread impactful ideas. Explore our{" "}
                <Link to="/partners" className="text-primary underline">
                  Partnership page
                </Link>{" "}
                or reach out directly via our{" "}
                <Link to="/contact" className="text-primary underline">
                  Contact page
                </Link>
                .
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Bottom Help & Contact Card */}
        <div className="mt-20 rounded-3xl border border-border bg-gradient-to-r from-card to-background p-8 sm:p-12 text-center space-y-4">
          <h3 className="font-display text-2xl sm:text-3xl text-foreground font-light">
            Have a special inquiry or question?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Our organizing committee is here to assist delegates, media representatives, and
            partners.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Button asChild variant="editorial" size="editorial">
              <Link to="/contact">Contact Organizing Team</Link>
            </Button>
            <Button asChild variant="outline" size="editorial">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
