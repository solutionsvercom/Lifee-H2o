import { m, useScroll, useTransform } from "motion/react";
import { lazy, Suspense, useMemo, useRef } from "react";

const BottleScene = lazy(() => import("./BottleScene"));

const waveBgStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='%230EA5E9' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
  backgroundSize: "100px 100px",
} as const;

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const dropletMotion = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return [...Array(12)].map(() => ({
      initX: Math.random() * w,
      endX: Math.random() * w,
      targetY: h + 20,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden scroll-mt-20"
    >
      {/* Animated Background */}
      <m.div
        style={{ y: backgroundY, willChange: "transform" }}
        className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0c3557] to-[#0A2540]"
      >
        <div className="absolute inset-0 opacity-20">
          <m.div
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0"
            style={waveBgStyle}
          />
        </div>
      </m.div>

      {/* Floating water droplets */}
      {dropletMotion.map((d, i) => (
        <m.div
          key={`hero-droplet-${i}`}
          className="absolute w-1.5 h-1.5 bg-cyan-300/60 rounded-full blur-[1px]"
          initial={{
            x: d.initX,
            y: -20,
            opacity: 0.6,
          }}
          animate={{
            y: d.targetY,
            x: d.endX,
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
          }}
        />
      ))}

      {/* Main content — original centered column layout */}
      <m.div
        style={{ opacity, willChange: "opacity" }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 pt-20 lg:pt-8 pb-12 sm:pb-16"
      >
        {/* Bottle container — same sizing as the original SVG wrapper */}
        <m.div
          className="relative mb-8 w-[330px] sm:w-[380px] md:w-[420px] lg:w-[clamp(260px,32vw,420px)] h-[500px] lg:h-[clamp(460px,80vh,760px)] max-w-full mx-auto"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Darker glow around bottle wrapper */}
          <div className="absolute inset-0 bg-slate-950/55 blur-[80px] scale-150 pointer-events-none" />

          {/* Studio lighting orbs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-950/35 rounded-full blur-3xl pointer-events-none" />

          <Suspense
            fallback={<div className="w-full h-full absolute inset-0" aria-hidden />}
          >
            <BottleScene />
          </Suspense>
        </m.div>

        {/* Premium Copy — identical to original */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center max-w-4xl space-y-5 sm:space-y-6"
        >
          <m.h1
            className="text-[clamp(2rem,8vw,4.5rem)] font-bold text-white tracking-tight leading-tight"
            style={{ textShadow: "0 0 40px rgba(14, 165, 233, 0.5)" }}
          >
            Purity Engineered.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Hydration Perfected.
            </span>
          </m.h1>

          <p className="text-[clamp(1rem,3vw,1.25rem)] text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            Crafted with advanced purification technology, delivering unmatched
            freshness and safety in every drop across Madhya Pradesh.
          </p>
        </m.div>
      </m.div>

      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </section>
  );
}
