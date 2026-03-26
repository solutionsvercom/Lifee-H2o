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
      className="relative py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-[#0A2540] scroll-mt-24"
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-bold text-white mb-6 leading-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Experience the difference of truly premium water with technology-driven quality
          </p>
        </m.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <m.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl h-full">
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
                      <h3 className="font-semibold text-white">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-cyan-100/70 leading-relaxed">
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
