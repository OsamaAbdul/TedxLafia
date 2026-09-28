import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface TicketButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "editorial" | "editorialOutline";
  size?: "default" | "sm" | "lg" | "icon" | "editorial";
  asChild?: boolean;
}

export function TicketButton({ children, className, variant = "editorial", size = "editorial" }: TicketButtonProps) {
  const [showModal, setShowModal] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setShowModal(true)}
      >
        {children}
      </Button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black border border-white/20 p-8 shadow-2xl text-center"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
              </div>
              
              <h3 className="font-display text-3xl text-white mb-2">Coming Soon!</h3>
              <p className="text-white/70 mb-8 font-sans">
                Tickets for TEDxLafia 2025 are not yet available. Please check back later or subscribe to our newsletter for updates.
              </p>
              
              <Button onClick={() => setShowModal(false)} variant="editorial" className="w-full">
                Understood
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
