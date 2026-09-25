import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ end, suffix = "", delay = 0 }: { end: number, suffix?: string, delay?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number;
    const duration = 2000;
    let timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(Math.floor(easeProgress * end));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden py-24 text-primary-foreground bg-primary">
      {/* Subtle chevron pattern */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L0 0h60zM30 30L60 60H0z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }}></div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="mb-16 font-sans text-xl md:text-2xl font-medium tracking-wide">
          TEDxLafia is building a community of storytellers and shifting the narrative
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col items-center justify-center">
            <Reveal>
              <div className="font-sans text-6xl md:text-7xl font-bold mb-2">
                <AnimatedNumber end={1000} suffix="+" />
              </div>
              <div className="text-xl md:text-2xl font-medium">Attendees</div>
            </Reveal>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Reveal delay={0.2}>
              <div className="font-sans text-6xl md:text-7xl font-bold mb-2">
                <AnimatedNumber end={10} delay={0.2} />
              </div>
              <div className="text-xl md:text-2xl font-medium">Speakers</div>
            </Reveal>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Reveal delay={0.4}>
              <div className="font-sans text-6xl md:text-7xl font-bold mb-2">
                <AnimatedNumber end={100000} suffix="+" delay={0.4} />
              </div>
              <div className="text-xl md:text-2xl font-medium">Views of our talks</div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Link
            to="/about"
            className="inline-flex h-12 items-center justify-center bg-background px-10 text-sm font-semibold text-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
