import type { CSSProperties } from "react";
import { m, useInView } from "motion/react";
import { useMemo, useRef, useSyncExternalStore } from "react";

const PRODUCT_CARD_IMAGE_STYLE: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center top",
  mixBlendMode: "luminosity",
  filter: "brightness(1.12) contrast(1.12) drop-shadow(0 0 25px rgba(14, 165, 233, 0.35))",
};

const PRODUCT_CARD_REFLECTION_STYLE: CSSProperties = {
  background: "radial-gradient(ellipse, rgba(14, 165, 233, 0.5), transparent)",
  filter: "blur(8px)",
};

const PRODUCT_HOVER_GLOW_STYLE: CSSProperties = {
  background: "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15), transparent 70%)",
};

const products = [
  { 
    size: "250ml", 
    price: "₹10", 
    use: "On-the-go hydration",
    image: "/images/lifee-bottle250.png" ,
  },
  { 
    size: "500ml", 
    price: "₹15", 
    use: "Daily essential",
    image: "/images/lifee-bottle500L.png" ,
  },
  { 
    size: "1L", 
    price: "₹25", 
    use: "Family size",
    image: "/images/lifee-bottle1L.png" ,
  },
  { 
    size: "2L", 
    price: "₹40", 
    use: "Home & Office",
    image: "/images/lifee-bottle2L.png" ,
  },
  { 
    size: "20L Jar", 
    price: "₹60", 
    use: "Bulk needs",
    image: "/images/lifee-bottle20L.png" ,
  },
];

export function ProductShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );

  const blobLayout = useMemo(
    () =>
      [...Array(5)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      })),
    []
  );

  return (
    <section 
      id="products"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] to-slate-900 scroll-mt-20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {blobLayout.map((pos, i) => (
          <m.div
            key={`product-blob-${i}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 100, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 2,
            }}
            className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl"
            style={pos}
          />
        ))}
      </div>

      <div className="section-container container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-[clamp(2rem,5vh,4rem)] text-center"
        >
          <h2 className="mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
            Product{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Showcase
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100/80">
            Designed for every moment — from everyday hydration to bulk home and office needs.
          </p>
        </m.div>

        {/* Product cards with realistic bottles */}
        <div className="product-cards-grid">
          {products.map((product, index) => (
            <m.div
              key={product.size}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={isMobile ? undefined : { scale: 1.05, y: -10 }}
              className="group relative flex h-full min-h-0 w-full min-w-0"
              style={{ 
                transformStyle: 'preserve-3d',
              }}
            >
                <div className="section-mobile-card product-mobile-card flex h-full min-h-0 w-full min-w-0 flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-[clamp(1rem,2vw,2rem)] backdrop-blur-lg transition-all duration-500 hover:border-cyan-400/50">
                {/* Realistic bottle image */}
                <div
                  className="product-card-media relative mb-6 min-h-0 w-full flex-1 overflow-hidden rounded-2xl bg-transparent"
                  style={{
                    minHeight: "clamp(12rem, 28vh, 17.5rem)",
                    background: "transparent",
                  }}
                >
                  {/* Product lighting */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                  
                  <m.img
                    src={product.image}
                    alt={product.size}
                    width={400}
                    height={560}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="w-full h-full object-cover"
                    style={PRODUCT_CARD_IMAGE_STYLE}
                  />

                  {/* Reflection under bottle */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 opacity-30"
                    style={PRODUCT_CARD_REFLECTION_STYLE}
                  />
                </div>

                {/* Product info */}
                <div className="product-card-content space-y-3 text-center">
                  <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold text-white">
                    {product.size}
                  </h3>
                  <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/60">
                    {product.use}
                  </p>
                  <div className="pt-2">
                    <span className="text-[clamp(1.25rem,3vw,2rem)] font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <m.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={PRODUCT_HOVER_GLOW_STYLE}
                />
              </div>
            </m.div>
          ))}
        </div>

        {/* Special offer badge */}
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-[clamp(2rem,5vh,3rem)] text-center"
        >
          <div className="inline-flex max-md:mx-auto max-md:w-full max-md:max-w-md max-md:flex-col max-md:items-center max-md:px-4 max-md:py-2.5 flex-nowrap items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] backdrop-blur-lg md:flex-row md:justify-center">
            <div className="flex max-md:w-full max-md:flex-row max-md:items-center max-md:justify-center flex-nowrap items-center gap-2">
              <span className="shrink-0 text-xl leading-none font-semibold text-cyan-400 max-md:mr-2">💧</span>
              <span className="text-center text-[clamp(0.85rem,1.3vw,1rem)] text-white max-md:block max-md:w-full max-md:text-center max-md:leading-snug max-md:mt-1">
                Bulk orders available • Contact us for wholesale pricing
              </span>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
