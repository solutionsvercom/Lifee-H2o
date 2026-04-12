import { m, useInView } from "motion/react";
import { useRef } from "react";
import { Cpu, Package, Truck, DollarSign, Heart } from "lucide-react";

const reasons = [
  {
    icon: Cpu,
    title: "Advanced Technology",
    description: "State-of-the-art purification systems with AI monitoring",
  },
  {
    icon: Package,
    title: "Hygienic Packaging",
    description: "Sealed in sterile environment with tamper-proof caps",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    description: "Timely delivery across Madhya Pradesh 24/7",
  },
  {
    icon: DollarSign,
    title: "Affordable Premium Quality",
    description: "Best-in-class water at competitive pricing",
  },
  {
    icon: Heart,
    title: "Trusted Local Brand",
    description: "Serving Madhya Pradesh with pride and commitment",
  },
];

export function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="why-us"
      ref={ref}
      className="relative bg-gradient-to-b from-slate-900 to-[#0A2540] scroll-mt-24"
    >
      <div className="container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-[clamp(2rem,5vh,4rem)] text-center"
        >
          <h2 className="mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100/80">
            Experience the difference of truly premium water with technology-driven quality
          </p>
        </m.div>

        {/* Reasons grid — same column rules as product grid (5 / 3+2 / 1) */}
        <div className="product-cards-grid">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <m.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group flex h-full min-h-0 w-full min-w-0 flex-col"
              >
                <div className="section-mobile-card relative flex h-full min-h-0 w-full min-w-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-[clamp(1rem,2vw,2rem)] shadow-xl backdrop-blur-lg">
                  {/* Soft glow on hover */}
                  <m.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500"
                  />

                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <m.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-400/30 group-hover:to-blue-500/30 transition-all duration-300">
                        <Icon className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      
                      {/* Glow */}
                      <m.div
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className="absolute inset-0 bg-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30"
                      />
                    </m.div>

                    {/* Text */}
                    <div className="space-y-2">
                      <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">
                        {reason.title}
                      </h3>
                      <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] leading-relaxed text-cyan-100/70">
                        {reason.description}
                      </p>
                    </div>
                  </div>

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border border-cyan-500/0 group-hover:border-cyan-500/30 transition-all duration-500" />
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
