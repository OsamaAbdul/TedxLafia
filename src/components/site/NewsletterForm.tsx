import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  invert,
  source = "website",
  className,
}: {
  invert?: boolean;
  source?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase(), source });
    setBusy(false);
    if (error) {
      if (error.code === "23505") {
        toast("You're already on the list.", { description: "We'll see you in the next issue." });
        setEmail("");
        return;
      }
      toast.error("Couldn't subscribe right now.", { description: "Please try again shortly." });
      return;
    }
    toast.success("Welcome to TEDxLafia.", { description: "Your first issue is on its way." });
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full max-w-md", className)}>
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-${source}`}
        type="email"
        required
        autoComplete="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          "h-12 min-w-0 flex-1 border bg-transparent px-4 text-sm outline-none transition-colors placeholder:opacity-50 focus-visible:border-primary",
          invert ? "border-ink-foreground/25 text-ink-foreground" : "border-input text-foreground",
        )}
      />
      <button
        type="submit"
        disabled={busy}
        aria-label="Subscribe"
        className="grid h-12 w-12 shrink-0 place-items-center bg-primary text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
