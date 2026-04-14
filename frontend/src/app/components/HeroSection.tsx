import { m, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useHeroParticleCount, usePrefersReducedMotion } from "../utils/devicePerformance";

function useBelowLgViewport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(max-width: 1023px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(max-width: 1023px)").matches,
    () => false,
  );
}

const slides = [
  {
    src: '/images/lifee-bottle.png',
    label: 'Lifee Water',
    size: 'Premium',
    desc: 'Pure & natural packaged drinking water',
  },
  {
    src: '/images/liffe-bottle-natural.png',
    label: 'Bharosa sehat ka Ehsaas Taazgi ka',
    size: 'Premium Packaged Water',
    desc: 'Experience the essence of health and freshness in every sip',
  },
  {
    src: '/images/lifee-bottle250.png',
    label: '250 ML',
    size: 'Small Pack',
    desc: 'Perfect for on-the-go hydration',
  },
  {
    src: '/images/lifee-bottle500L.png',
    label: '500 ML',
    size: 'Regular Pack',
    desc: 'Ideal for daily use and travel',
  },
  {
    src: '/images/lifee-bottle1L.png',
    label: '1 Litre',
    size: 'Family Pack',
    desc: 'Great for home and office use',
  },
  {
    src: '/images/lifee-bottle2L.png',
    label: '2 Litre',
    size: 'Large Pack',
    desc: 'Best value for families',
  },
  {
    src: '/images/lifee-bottle20L.png',
    label: '20 Litre',
    size: 'Bulk Pack',
    desc: 'Perfect for bulk and commercial use',
  },
  {
    src: '/images/liffe-bottle-key.png',
    label: 'Distributor Key',
    size: 'Become a Distributor',
    desc: 'Join our network and bring pure hydration',
  },
] as const;

const SLIDE_COUNT = 8;

function HeroSectionInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isBelowLg = useBelowLgViewport();
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
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (prefersReducedMotion) return;
    timerRef.current = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
    }, 4000);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTimer, prefersReducedMotion]);

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
    startTimer();
  }, [startTimer]);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
    startTimer();
  }, [startTimer]);

  const goToSlide = useCallback(
    (i: number) => {
      setSlideIndex(i);
      startTimer();
    },
    [startTimer],
  );

  const currentSlide = useMemo(() => slides[slideIndex], [slideIndex]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="hero-section relative w-full min-w-0 min-h-screen scroll-mt-20"
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
            className="hero-wave-pattern absolute inset-0"
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
      <m.div className="hero-main relative z-10 mx-auto flex w-full max-w-7xl min-w-0 flex-col items-center justify-center gap-8 px-4 pb-12 pt-20 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pb-16 lg:pt-10">
        {/* Premium Copy */}
        <m.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-copy order-1 flex w-full flex-col justify-center space-y-4 px-6 pt-8 text-center md:px-0 md:pt-0 lg:w-1/2">
          <m.h1 className="hero-title max-md:text-center text-[clamp(2rem,5vw,4rem)] font-bold leading-tight tracking-tight text-white [text-shadow:0_0_40px_rgba(14,165,233,0.5)]">
            <span className="hero-line-primary text-[clamp(2rem,5vw,4rem)]">Purity Engineered.</span>
            <span className="hero-title-highlight block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-[clamp(2rem,5vw,4rem)] text-transparent">
              Hydration Perfected.
            </span>
          </m.h1>

          <p className="hero-lead mx-auto mb-6 max-w-2xl break-words leading-relaxed text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100">
            Crafted with advanced purification technology, delivering unmatched
            freshness and safety in every drop across Madhya Pradesh.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2.5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-400" />
            <p className="m-0 whitespace-nowrap text-center font-serif text-[clamp(0.85rem,1.5vw,1.1rem)] font-semibold tracking-wide text-cyan-400">
              भरोसा शुद्धता का, एहसास ताज़गी का
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </m.div>

        {/* Bottle slideshow */}
        <div className="hero-slideshow-shell relative order-2 flex w-full flex-col items-center lg:w-1/2" aria-live="polite" aria-label="Product bottle images">
          <div className="hero-slideshow-visual relative flex w-full max-w-full flex-col items-center">
            <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
              <div
                className={`hero-product-card relative ${isBelowLg ? "max-lg:isolate max-lg:[transform:translateZ(0)]" : ""}`}
              >
                <button
                  type="button"
                  onClick={goPrev}
                  className="hero-arrow hero-arrow-prev absolute left-[8px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cyan-400/80 text-lg leading-none text-cyan-300 transition-colors hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 lg:h-12 lg:w-12 lg:text-2xl"
                  aria-label="Previous slide"
                >
                  ‹
                </button>

                {isBelowLg ? (
                  <div className="absolute inset-0 isolate overflow-hidden rounded-[20px] [transform:translateZ(0)]">
                    {slides.map((slide, i) => {
                      const isActive = i === slideIndex;
                      return (
                        <div
                          key={slide.src}
                          aria-hidden={isActive ? undefined : true}
                          className={`absolute inset-0 transition-opacity duration-[400ms] ease-in-out will-change-[opacity] ${isActive ? "z-[1] opacity-100" : "z-0 opacity-0"} ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
                        >
                          <img
                            src={slide.src}
                            alt={slide.label}
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="hero-bottle-img absolute inset-0 h-full w-full object-contain object-center [backface-visibility:hidden] [transform:translateZ(0)] [will-change:auto]"
                            draggable={false}
                          />
                          <div className="absolute bottom-0 left-0 right-0 z-[2] bg-gradient-to-b from-transparent to-[rgba(0,8,25,0.97)] px-4 pb-4 pt-10 text-center">
                            <p className="m-0 text-[clamp(0.9rem,2vw,1.3rem)] font-bold text-white">{slide.label}</p>
                            <p className="mt-1 text-[clamp(0.6rem,0.9vw,0.75rem)] text-white/65">{slide.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait" initial={false}>
                      <m.img
                        key={currentSlide.src}
                        src={currentSlide.src}
                        alt={currentSlide.label}
                        loading={slideIndex === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={slideIndex === 0 ? "high" : "auto"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="hero-bottle-img absolute inset-0 block h-full w-full bg-transparent object-contain object-center"
                        draggable={false}
                      />
                    </AnimatePresence>
                    <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-1 bg-gradient-to-b from-transparent to-[rgba(0,8,25,0.97)] px-4 pb-4 pt-10 text-center">
                      <p className="m-0 text-[clamp(1rem,2vw,1.3rem)] font-bold leading-snug text-white">{currentSlide.label}</p>
                      <p className="m-0 text-[clamp(0.6rem,0.9vw,0.75rem)] leading-snug text-white/65">{currentSlide.desc}</p>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  className="hero-arrow hero-arrow-next absolute right-[8px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cyan-400/80 text-lg leading-none text-cyan-300 transition-colors hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 lg:h-12 lg:w-12 lg:text-2xl"
                  aria-label="Next slide"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="hero-slide-size mt-2 hidden text-center lg:block">
              <span className="inline-flex rounded-full border border-cyan-400/70 px-3 py-1 text-xs font-medium text-cyan-200 sm:text-sm">
                {currentSlide.size}
              </span>
            </div>

          </div>

          <div
            className="hero-slide-dots relative z-10 mt-2 flex flex-wrap items-center justify-center gap-1.5 opacity-100"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === slideIndex ? "true" : "false"}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={
                  i === slideIndex
                    ? "block h-2.5 w-2.5 scale-125 rounded-full bg-cyan-400 opacity-100 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all"
                    : "block h-2 w-2 rounded-full border-2 border-cyan-400/50 bg-transparent opacity-100 transition-all hover:border-cyan-400/80"
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
