import { motion, useInView } from "motion/react";
import { useRef } from "react";

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

  return (
    <section 
      id="products"
      ref={ref}
      className="relative py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#0A2540] to-slate-900 overflow-hidden scroll-mt-24"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
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
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-bold text-white mb-6 leading-tight">
            Product{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Showcase
            </span>
          </h2>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Designed for every moment — from everyday hydration to bulk home and office needs.
          </p>
        </motion.div>

        {/* Product cards with realistic bottles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                y: -10,
              }}
              className="group relative"
              style={{ 
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 hover:border-cyan-400/50 transition-all duration-500">
                {/* Realistic bottle image */}
                <div
                  className="relative mb-6 w-full overflow-hidden rounded-2xl bg-transparent"
                  style={{
                    height: "280px",
                    background: "transparent",
                  }}
                >
                  {/* Product lighting */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                  
                  <motion.img
                    src={product.image}
                    alt={product.size}
                    className="w-full h-full object-cover"
                    style={{
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
                    }}
                  />

                  {/* Reflection under bottle */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 opacity-30"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(14, 165, 233, 0.5), transparent)',
                      filter: 'blur(8px)',
                    }}
                  />
                </div>

                {/* Product info */}
                <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-bold text-white">
                    {product.size}
                  </h3>
                  <p className="text-cyan-100/60 text-sm">
                    {product.use}
                  </p>
                  <div className="pt-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15), transparent 70%)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special offer badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-lg border border-cyan-400/30">
            <span className="text-cyan-400 font-semibold">💧</span>
            <span className="text-white">
              Bulk orders available • Contact us for wholesale pricing
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
