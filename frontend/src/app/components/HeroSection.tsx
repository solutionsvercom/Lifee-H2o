import { m, AnimatePresence, useScroll, useTransform } from "motion/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHeroParticleCount, usePrefersReducedMotion } from "../utils/devicePerformance";

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

const waveBgStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='%230EA5E9' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
  backgroundSize: "100px 100px",
} as const;

function HeroSectionInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);
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
    const preloaders = slides.map((slide) => {
      const img = new Image();
      img.src = slide.src;
      return img;
    });

    if (prefersReducedMotion) return;

    const startAutoSlide = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      if (slideTimerRef.current !== null) {
        clearInterval(slideTimerRef.current);
      }
      slideTimerRef.current = window.setInterval(() => {
        setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
      }, 4000);
    };

    const firstImage = preloaders[0];
    if (firstImage?.complete) {
      startAutoSlide();
    } else if (firstImage) {
      firstImage.addEventListener("load", startAutoSlide, { once: true });
      firstImage.addEventListener("error", startAutoSlide, { once: true });
    }

    return () => {
      if (firstImage) {
        firstImage.removeEventListener("load", startAutoSlide);
        firstImage.removeEventListener("error", startAutoSlide);
      }
      if (slideTimerRef.current !== null) {
        clearInterval(slideTimerRef.current);
        slideTimerRef.current = null;
      }
      hasStartedRef.current = false;
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
      <m.div className="hero-main relative z-10 mx-auto flex w-full max-w-7xl min-w-0 flex-col items-center justify-center gap-8 px-4 pb-12 pt-20 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pb-16 lg:pt-10">
        {/* Premium Copy */}
        <m.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-copy order-1 flex w-full flex-col justify-center space-y-4 px-6 pt-8 text-center md:px-0 md:pt-0 lg:w-1/2">
          <m.h1
            className="hero-title text-[clamp(2rem,5vw,4rem)] font-bold leading-tight tracking-tight text-white max-md:text-center"
            style={{ textShadow: "0 0 40px rgba(14, 165, 233, 0.5)" }}
          >
            <span className="hero-line-primary text-[clamp(2rem,5vw,4rem)]">Purity Engineered.</span>
            <span className="hero-title-highlight block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-[clamp(2rem,5vw,4rem)] text-transparent">
              Hydration Perfected.
            </span>
          </m.h1>

          <p className="hero-lead mx-auto mb-6 max-w-2xl break-words leading-relaxed text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100">
            Crafted with advanced purification technology, delivering unmatched
            freshness and safety in every drop across Madhya Pradesh.
          </p>
        </m.div>

        {/* Bottle slideshow */}
        <div className="hero-slideshow-shell relative order-2 flex w-full flex-col items-center lg:w-1/2" aria-live="polite" aria-label="Product bottle images">
          <div className="hero-slideshow-visual relative flex w-full max-w-full flex-col items-center">
            <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
              <div
                className="hero-product-card relative"
                style={{
                  border: "1.5px solid rgba(0,200,255,0.35)",
                  borderRadius: "20px",
                  boxShadow: `
                    0 0 0 1px rgba(0,200,255,0.1),
                    0 0 30px rgba(0,180,255,0.25),
                    0 0 60px rgba(0,180,255,0.1)
                  `,
                  overflow: "hidden",
                  background: "rgba(0,15,35,0.5)",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={goPrev}
                  className="hero-arrow hero-arrow-prev absolute left-[8px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cyan-400/80 text-lg leading-none text-cyan-300 transition-colors hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 lg:h-12 lg:w-12 lg:text-2xl"
                  aria-label="Previous slide"
                >
                  ‹
                </button>

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
                    className="hero-bottle-img absolute inset-0 h-full w-full object-contain object-center"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                      display: "block",
                      background: "transparent",
                    }}
                    draggable={false}
                  />
                </AnimatePresence>

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

            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={`content-${currentSlide.src}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="hero-slide-info mt-3 w-full text-center"
                style={{
                  position: "static",
                  marginTop: "12px",
                  zIndex: 20,
                }}
              >
                <div className="hero-slide-heading flex flex-col items-center justify-center gap-2">
                  <p className="hero-slide-label text-[1.2rem] text-cyan-300">{currentSlide.label}</p>
                  <div className="hero-slide-size">
                    <span className="inline-flex rounded-full border border-cyan-400/70 px-3 py-1 text-xs font-medium text-cyan-200 sm:text-sm">
                      {currentSlide.size}
                    </span>
                  </div>
                </div>
                <p className="hero-slide-desc mx-auto mt-2 max-w-md text-[0.85rem] leading-snug text-white/80">
                  {currentSlide.desc}
                </p>
              </m.div>
            </AnimatePresence>
          </div>

          <div
            className="hero-slide-dots mt-3 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Slide indicators"
            style={{
              display: "flex",
              visibility: "visible",
              opacity: 1,
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "6px",
              marginTop: "8px",
              zIndex: 10,
              position: "relative",
            }}
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
                    ? "transition-all"
                    : "transition-all hover:border-cyan-400/80"
                }
                style={
                  i === slideIndex
                    ? {
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#22d3ee",
                        opacity: 1,
                        display: "block",
                        boxShadow: "0 0 8px rgba(34,211,238,0.6)",
                        transform: "scale(1.2)",
                      }
                    : {
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        border: "2px solid rgba(34,211,238,0.5)",
                        background: "transparent",
                        opacity: 1,
                        display: "block",
                      }
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
