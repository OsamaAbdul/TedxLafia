import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "./SectionHeading";
import { NAV } from "@/lib/site";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ExploreSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={containerRef} className="section-pad bg-black text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50 pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        <SectionHeading
          eyebrow="Explore"
          title="Discover TEDxLafia"
          description="Our platform exists because our city is full of people solving real problems. We are creating a stage for the ideas already here."
          className="[&_h2]:!text-white [&_p:last-child]:!text-white/80"
        />
        
        <motion.div style={{ y }} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NAV.map((item, i) => {
            const to = item.to || item.children?.[0]?.to;
            if (!to) return null;

            return (
              <Reveal key={item.label} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="h-full"
                >
                  <Link
                    to={to}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-primary/50 hover:bg-white/10 text-white h-48 lg:h-56 shadow-lg backdrop-blur-sm"
                  >
                    {/* Hover Glow Effect inside card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <span className="font-display text-3xl sm:text-4xl font-light relative z-10">{item.label}</span>
                    
                    <div className="flex items-center justify-between relative z-10 mt-auto pt-4">
                      <span className="eyebrow text-white/50 group-hover:text-primary transition-colors duration-300">
                        Explore
                      </span>
                      <span className="text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
