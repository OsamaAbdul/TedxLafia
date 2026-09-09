import { Link } from "@tanstack/react-router";
import { NAV, SITE } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="grid-bg grid-bg-ink bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <Logo className="text-2xl text-ink-foreground [&>span:last-child]:opacity-50" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-foreground/60">
              This independent TEDx event is operated under license from TED. {SITE.city}.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="eyebrow link-hairline w-fit py-1 text-ink-foreground/70 hover:text-ink-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.registerUrl}
              target="_blank"
              rel="noreferrer"
              className="eyebrow link-hairline w-fit py-1 text-primary"
            >
              Register
            </a>
          </nav>

          <div>
            <p className="eyebrow text-ink-foreground/70">Newsletter</p>
            <p className="mt-4 font-display text-2xl font-light">
              Ideas in your inbox, once a month.
            </p>
            <div className="mt-6">
              <NewsletterForm invert source="footer" />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-foreground/10 pt-8 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TEDxLafia. All rights reserved.</p>
          <ul className="flex gap-6">
            {Object.entries(SITE.social).map(([key, href]) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="eyebrow link-hairline hover:text-ink-foreground"
                >
                  {key === "x" ? "X" : key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
