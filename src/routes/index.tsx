import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import comingSoonImg from "@/assets/coming-soon.jpeg";

export const Route = createFileRoute("/")({
  component: ComingSoonPage,
});

function ComingSoonPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#070002] px-4 py-4 sm:py-6">
      {/* Ambient background glow echoing the poster's red spotlight */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,46,45,0.15)_0%,transparent_75%)]"
        aria-hidden="true"
      />

      <motion.main
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center"
      >
        <img
          src={comingSoonImg}
          alt="TEDxLafia — Coming Soon"
          className="h-auto max-h-[94vh] w-auto max-w-full rounded-sm object-contain shadow-2xl ring-1 ring-white/10"
          loading="eager"
        />
      </motion.main>
    </div>
  );
}
