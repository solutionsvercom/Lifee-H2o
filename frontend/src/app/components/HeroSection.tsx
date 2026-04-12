import { m, useScroll, useTransform } from "motion/react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHeroParticleCount, usePrefersReducedMotion } from "../utils/devicePerformance";

const slides = [
  {
    src: "/images/lifee-bottle.png",
    label: "Lifee Water",
    size: "Premium",
    desc: "Pure & natural packaged drinking water",
  },
  {
    src: "/images/lifee-bottle250.png",
    label: "250 ML",
    size: "Small Pack",
    desc: "Perfect for on-the-go hydration",
  },
  {
    src: "/images/lifee-bottle500L.png",
    label: "500 ML",
    size: "Regular Pack",
    desc: "Ideal for daily use and travel",
  },
  {
    src: "/images/lifee-bottle1L.png",
    label: "1 Litre",
    size: "Family Pack",
    desc: "Great for home and office use",
  },
  {
    src: "/images/lifee-bottle2L.png",
    label: "2 Litre",
    size: "Large Pack",
    desc: "Best value for families",
  },
  {
    src: "/images/lifee-bottle20L.png",
    label: "20 Litre",
    size: "Bulk Pack",
    desc: "Perfect for bulk and commercial use",
  },
] as const;

const SLIDE_COUNT = slides.length;

const waveBgStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='%230EA5E9' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
  backgroundSize: "100px 100px",
} as const;

function preloadSlideImages(): Promise<void> {
  return Promise.all(
    slides.map(
      (slide) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = slide.src;
        }),
    ),
  ).then(() => undefined);
}

function HeroSectionInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropletCount = useHeroParticleCount();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [slideIndex, setSlideIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const dropletMotion = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return [...Array(dropletCount)].map(() => ({
      initX: Math.random() * w,
      endX: Math.random() * w,
      targetY: h + 20,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
  }, [dropletCount]);

  useEffect(() => {
    let cancelled = false;

    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });

    const startAuto = () => {
      if (cancelled || prefersReducedMotion) return;
      if (slideTimerRef.current !== null) {
        clearInterval(slideTimerRef.current);
      }
      slideTimerRef.current = window.setInterval(() => {
        setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
      }, 4000);
    };

    preloadSlideImages().then(() => {
      if (!cancelled && !prefersReducedMotion) startAuto();
    });

    return () => {
      cancelled = true;
      if (slideTimerRef.current !== null) {
        clearInterval(slideTimerRef.current);
        slideTimerRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
  }, []);

  const goToSlide = useCallback((i: number) => {
    setSlideIndex(i);
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="hero-section relative flex w-full min-w-0 flex-col scroll-mt-20 md:min-h-0 md:overflow-hidden max-md:h-[100svh] max-md:max-h-[100svh] max-md:min-h-0 max-md:items-center max-md:justify-evenly max-md:p-0"
    >
      {/* Animated Background */}
      <m.div
        style={{ y: backgroundY, willChange: "transform" }}
        className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0c3557] to-[#0A2540]"
      >
        <div className="absolute inset-0 opacity-20">
          <m.div
            animate={
              prefersReducedMotion
                ? undefined
                : { backgroundPosition: ["0% 0%", "100% 100%"] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 28, repeat: Infinity, repeatType: "reverse" }
            }
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

      {/* Main content */}
      <m.div
        className="hero-main relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-wrap items-center justify-center gap-[clamp(1rem,3vw,3rem)] px-[clamp(1rem,5vw,5rem)] pb-[clamp(2rem,6vh,4rem)] max-md:max-w-none max-md:flex-1 max-md:flex-col max-md:flex-nowrap max-md:items-center max-md:justify-evenly max-md:gap-0 max-md:px-0 max-md:pb-0 md:h-full md:min-h-0 md:flex-nowrap md:flex-row md:items-center md:pb-0"
      >
        {/* Premium Copy */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.6 }}
          className="hero-copy order-1 flex min-w-[min(300px,100%)] flex-[1_1_min(300px,100%)] flex-col justify-center space-y-[clamp(1rem,2vh,1.5rem)] text-center max-md:w-full max-md:flex-none max-md:space-y-0 max-md:px-0 md:max-w-4xl lg:max-w-[50%]"
        >
          <m.h1
            className="hero-title text-[clamp(2rem,5vw,4rem)] font-bold leading-tight tracking-tight text-white max-md:text-center"
            style={{ textShadow: "0 0 40px rgba(14, 165, 233, 0.5)" }}
          >
            <span className="hero-line-primary text-[clamp(2rem,5vw,4rem)]">Purity Engineered.</span>
            <span className="hero-title-highlight mt-0 block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-[clamp(2rem,5vw,4rem)] text-transparent">
              Hydration Perfected.
            </span>
          </m.h1>

          <p className="hero-lead mx-auto max-w-2xl break-words leading-relaxed text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100 max-md:max-w-full max-md:text-center">
            Crafted with advanced purification technology, delivering unmatched
            freshness and safety in every drop across Madhya Pradesh.
          </p>
        </m.div>

        {/* Bottle slideshow */}
        <div
          className="hero-slideshow-shell relative order-2 mt-4 flex min-h-0 w-full min-w-[min(300px,100%)] flex-[1_1_min(300px,100%)] max-w-full flex-col items-center max-md:mt-0 max-md:w-full max-md:min-h-0 md:mt-0 md:h-full md:min-h-0 lg:max-w-[50%]"
          aria-live="polite"
          aria-label="Product bottle images"
        >
          <div className="hero-slideshow-visual relative flex w-full max-w-full flex-col items-center max-md:min-h-0">
            <div className="relative mx-auto flex w-full max-w-full flex-wrap items-center justify-center gap-1 sm:gap-2 max-md:w-[80vw] md:max-w-full">
              <button
                type="button"
                onClick={goPrev}
                className="shrink-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-400/80 text-cyan-300 text-lg leading-none transition-colors hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 md:relative max-md:absolute max-md:left-[8px] max-md:top-1/2 max-md:h-7 max-md:w-7 max-md:-translate-y-1/2 max-md:text-[0.8rem] lg:h-12 lg:w-12 lg:text-2xl"
                aria-label="Previous slide"
              >
                ‹
              </button>

              <div className="hero-product-card relative mx-auto box-border shrink-0 overflow-hidden rounded-2xl border border-[rgba(0,200,255,0.15)] bg-[rgba(0,20,40,0.6)] shadow-[0_0_40px_rgba(0,180,255,0.15)]">
                {slides.map((slide, i) => {
                  const isActive = i === slideIndex;
                  return (
                    <div
                      key={slide.src}
                      className={`hero-slide-layer absolute inset-0 z-0 transition-opacity duration-[600ms] ease-in-out ${
                        isActive
                          ? "hero-slide-layer--active z-[1] opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                      aria-hidden={!isActive}
                    >
                      <img
                        src={slide.src}
                        alt={slide.label}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "low"}
                        className="hero-bottle-img absolute inset-0 z-0 h-full w-full object-contain object-center"
                        style={{ mixBlendMode: "lighten" }}
                        draggable={false}
                      />
                      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-b from-transparent to-[rgba(0,10,30,0.9)] p-4 text-center">
                        <p className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold leading-tight text-white">
                          {slide.label}
                        </p>
                        <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] leading-tight text-cyan-300">
                          {slide.size}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="shrink-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-400/80 text-cyan-300 text-lg leading-none transition-colors hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 md:relative max-md:absolute max-md:right-[8px] max-md:top-1/2 max-md:h-7 max-md:w-7 max-md:-translate-y-1/2 max-md:text-[0.8rem] lg:h-12 lg:w-12 lg:text-2xl"
                aria-label="Next slide"
              >
                ›
              </button>
            </div>
          </div>

          <div
            className="hero-slide-dots mt-4 flex flex-wrap items-center justify-center gap-2 max-md:mt-0 max-md:mb-0 md:mt-0"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === slideIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={
                  i === slideIndex
                    ? "h-3 w-3 rounded-full bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.45)] transition-all"
                    : "h-2.5 w-2.5 rounded-full border-2 border-cyan-400/50 bg-transparent transition-all hover:border-cyan-400/80"
                }
              />
            ))}
          </div>
        </div>
      </m.div>

      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </section>
  );
}

export const HeroSection = memo(HeroSectionInner);
HeroSectionInner.displayName = "HeroSection";
