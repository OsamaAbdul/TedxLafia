import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const field =
  "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary";

const WEB3FORMS_ACCESS_KEY: string =
  ((import.meta.env as Record<string, string | undefined>)["VITE_WEB3FORMS_ACCESS_KEY"] || "");

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: defaultSubject, message: "" });

  const update = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    if (!WEB3FORMS_ACCESS_KEY) {
      toast.error("Configuration Error", {
        description: "VITE_WEB3FORMS_ACCESS_KEY is not configured in your environment.",
      });
      return;
    }

    setBusy(true);
    setResult("");

    try {
      const formData = new FormData(event.currentTarget);
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Success!");
        toast.success("Message received.", {
          description: "The TEDxLafia team will reply within a few days.",
        });
        setForm({ name: "", email: "", subject: defaultSubject, message: "" });
      } else {
        setResult("Error");
        toast.error("Message not sent.", {
          description: data.message || "Please try again in a moment.",
        });
      }
    } catch {
      setResult("Error");
      toast.error("Message not sent.", {
        description: "Network error. Please try again in a moment.",
      });
    } finally {
      setBusy(false);
    }
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
            name="name"
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
            name="email"
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
          name="subject"
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
          name="message"
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
        {result && (
          <p
            className={`mt-4 text-sm font-medium ${
              result === "Success!" ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {result === "Success!"
              ? "Thank you! Your message has been sent successfully."
              : "Failed to send message. Please try again."}
          </p>
        )}
      </div>
    </form>
  );
}

export default ContactForm;
