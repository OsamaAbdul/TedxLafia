import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert,
  className,
}: Props) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "eyebrow flex items-center gap-3 text-primary",
          align === "center" && "justify-center",
        )}
      >
        <span className="mark-red" aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-5 font-display text-4xl leading-[1.02] font-light tracking-tight sm:text-5xl lg:text-6xl",
          invert ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed sm:text-lg",
            invert ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
