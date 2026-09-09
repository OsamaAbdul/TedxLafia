import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const field =
  "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary";

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: defaultSubject, message: "" });

  const update = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    setBusy(false);
    if (error) {
      toast.error("Message not sent.", { description: "Please try again in a moment." });
      return;
    }
    toast.success("Message received.", {
      description: "The TEDxLafia team will reply within a few days.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate={false}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="eyebrow text-muted-foreground">
            Name
          </label>
          <input
            id="c-name"
            required
            maxLength={120}
            autoComplete="name"
            className={field}
            value={form.name}
            onChange={update("name")}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="eyebrow text-muted-foreground">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={field}
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="eyebrow text-muted-foreground">
          Subject
        </label>
        <input
          id="c-subject"
          maxLength={200}
          className={field}
          value={form.subject}
          onChange={update("subject")}
          placeholder="Speaking, partnership, volunteering…"
        />
      </div>
      <div>
        <label htmlFor="c-message" className="eyebrow text-muted-foreground">
          Message
        </label>
        <textarea
          id="c-message"
          required
          rows={5}
          maxLength={4000}
          className={`${field} resize-none`}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us what's on your mind."
        />
      </div>
      <div>
        <Button type="submit" variant="editorial" size="editorial" disabled={busy}>
          {busy ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
