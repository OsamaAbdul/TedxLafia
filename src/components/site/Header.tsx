import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EASE } from "./Reveal";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label={`${SITE.name} home`}
      className={cn("flex items-baseline gap-0.5 font-sans font-semibold tracking-tight", className)}
    >
      <span className="text-primary">TEDx</span>
      <span>Lafia</span>
      <span className="ml-1.5 self-center text-[9px] font-normal tracking-[0.25em] uppercase opacity-60">
        x = independently organized TED event
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-black/20 backdrop-blur-md transition-all duration-500 text-white"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 lg:px-10">
        <Logo className="min-w-0 text-xl [&>span:last-child]:hidden sm:[&>span:last-child]:inline" />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            item.children ? (
              <div key={item.label} className="group relative">
                <button className="eyebrow link-hairline py-6 -my-4 text-white/80 transition-colors group-hover:text-white outline-none cursor-default">
                  {item.label}
                </button>
                <div className="absolute left-0 top-full hidden w-48 opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
                  <div className="bg-background border border-border rounded-xl p-1.5 shadow-editorial">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block w-full px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-ink hover:text-ink-foreground transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to!}
                className="eyebrow link-hairline py-2 text-white/80 transition-colors hover:text-white"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            )
          ))}
          <Button asChild variant="editorial" size="editorial">
            <a href={SITE.registerUrl} target="_blank" rel="noreferrer">
              GET TICKET
            </a>
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 shrink-0 place-items-center border border-white/30 lg:hidden text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid-bg h-[calc(100dvh-5rem)] overflow-y-auto border-t bg-background lg:hidden text-foreground"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-6 py-6">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                  className="border-b flex flex-col py-2"
                >
                  {item.children ? (
                    <div className="flex flex-col gap-3 py-3">
                      <span className="font-display text-3xl font-light text-muted-foreground">{item.label}</span>
                      <div className="flex flex-col gap-4 pl-4 border-l border-border mt-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setOpen(false)}
                            className="font-display text-2xl font-light text-foreground"
                            activeProps={{ className: "text-primary" }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.to!}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3 font-display text-3xl font-light"
                      activeProps={{ className: "text-primary" }}
                    >
                      {item.label}
                      <span className="eyebrow text-muted-foreground">0{i + 1}</span>
                    </Link>
                  )}
                </motion.li>
              ))}
              <li className="pt-8">
                <Button asChild variant="editorial" size="editorial" className="w-full">
                  <a href={SITE.registerUrl} target="_blank" rel="noreferrer">
                    Register for TEDxLafia
                  </a>
                </Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
