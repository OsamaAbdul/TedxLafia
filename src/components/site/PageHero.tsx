import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <section className="grid-bg border-b pt-32 pb-16 lg:pt-44 lg:pb-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="eyebrow flex items-center gap-3 text-primary"
          >
            <span className="mark-red" aria-hidden />
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="mt-6 font-display text-5xl leading-[0.98] font-light tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              {description}
            </motion.p>
          )}
        </div>
        {aside && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="self-end"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}
