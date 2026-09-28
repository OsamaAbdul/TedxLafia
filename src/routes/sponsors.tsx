import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { RegisterBanner } from "@/components/site/RegisterBanner";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

const SPONSORS = [
  { id: 1, image: "/sponsors/Adogi.png" },
  { id: 2, image: "/sponsors/Captain.png" },

  { id: 5, image: "/sponsors/Ibrahim.png" },
  { id: 6, image: "/sponsors/Margret.png" },
  { id: 7, image: "/sponsors/Munira.png" },
  { id: 8, image: "/sponsors/State.png" },
  { id: 9, image: "/sponsors/Wadada.png" },
  { id: 10, image: "/sponsors/ib_abdullahi.png" },
];

function SponsorsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-black text-white min-h-screen">
      <PageHero
        eyebrow="Our Partners"
        title="Our Sponsors"
        description="We are immensely grateful to the organizations and individuals who make TEDxLafia possible. Their support empowers us to share ideas that matter."
        aside={
          <img
            src="/sponsors/General.png"
            alt="General Sponsor"
            className="w-full max-w-[280px] sm:max-w-xs mx-auto lg:ml-auto object-contain drop-shadow-2xl"
          />
        }
      />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 pb-16">
            {SPONSORS.map((sponsor, i) => {
              // Create an alternating pattern for tall images
              const isTall = i % 4 === 0 || i === 5;
              
              return (
                <Reveal 
                  key={sponsor.id} 
                  delay={i * 0.1}
                  className="block break-inside-avoid mb-4 sm:mb-6"
                >
                  <button
                    onClick={() => setSelectedImage(sponsor.image)}
                    className={`w-full flex items-center justify-center group cursor-pointer focus:outline-none rounded-2xl overflow-hidden shadow-xl relative border border-white/10 transition-all duration-500 hover:border-primary/50 ${isTall ? 'aspect-[3/4]' : 'aspect-square'}`}
                    aria-label="View sponsor image"
                  >
                    <img
                      src={sponsor.image}
                      alt={`Sponsor ${sponsor.id}`}
                      className="w-full h-full object-cover filter opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-medium bg-black/60 px-5 py-2 rounded-full border border-white/20 shadow-xl">
                        View
                      </span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <RegisterBanner />

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-2xl cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Sponsor Expanded"
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 sm:-right-12 sm:top-0 text-white/50 hover:text-white transition-colors bg-black/50 hover:bg-black/80 p-2.5 rounded-full backdrop-blur-md border border-white/10"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
