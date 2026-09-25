import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { EASE } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  bgImage,
  bgImages,
  children,
  bottomOverlay,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
  bgImage?: string;
  bgImages?: (string | { url: string; position: string })[];
  children?: ReactNode;
  bottomOverlay?: ReactNode;
}) {
  const images = (bgImages || (bgImage ? [bgImage] : [])).map((img) =>
    typeof img === "string" ? { url: img, position: "center" } : img
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative text-white pt-32 pb-16 lg:pt-44 lg:pb-24 z-20">
      {images.length > 0 ? (
        <>
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
              style={{ 
                backgroundImage: `url(${images[currentIndex]?.url})`,
                backgroundPosition: images[currentIndex]?.position
              }}
              aria-hidden="true"
            />
          </AnimatePresence>
          {/* Blurs only the edges using a radial mask */}
          <div
            className="pointer-events-none absolute inset-0 z-0 backdrop-blur-md"
            style={{
              maskImage: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
            }}
          />
          {/* Dark overlay to ensure white text remains readable */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-black/40" />
          {/* Smooth gradient at the bottom to blend into the next section seamlessly */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-black to-transparent" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 grid-bg" aria-hidden="true" />
      )}
      
      {bottomOverlay && (
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0">
          {bottomOverlay}
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`eyebrow flex items-center gap-3 ${images.length > 0 ? "text-white/90" : "text-primary"}`}
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
              className={`mt-8 max-w-3xl text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed ${images.length > 0 ? "text-white/90" : "text-muted-foreground"}`}
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              {children}
            </motion.div>
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
