import { m, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Droplets, Shield, Zap, Filter, Package } from "lucide-react";

const steps = [
  {
    icon: Droplets,
    title: "Source Collection",
    description: "Premium water sourced from protected natural reserves",
    color: "#06B6D4",
  },
  {
    icon: Filter,
    title: "Reverse Osmosis",
    description: "Advanced RO filtration removes 99.9% of contaminants",
    color: "#0EA5E9",
  },
  {
    icon: Zap,
    title: "UV Sterilization",
    description: "Ultraviolet treatment eliminates harmful microorganisms",
    color: "#3B82F6",
  },
  {
    icon: Shield,
    title: "Ozonization",
    description: "Ozone infusion ensures long-lasting purity",
    color: "#06B6D4",
  },
  {
    icon: Filter,
    title: "Micro Filtration",
    description: "Final stage removes any remaining particles",
    color: "#0EA5E9",
  },
  {
    icon: Package,
    title: "Automated Packaging",
    description: "Hygienic sealed packaging in controlled environment",
    color: "#3B82F6",
  },
];

export function PurificationProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section 
      id="process"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-slate-800 to-[#0A2540] scroll-mt-20"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-[clamp(2rem,5vh,4rem)] text-center"
        >
          <h2 className="mb-[clamp(0.75rem,2vh,1rem)] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
            Purification{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100/80">
            Tech Visual Flow: Advanced 6-stage purification system
          </p>
        </m.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 hidden lg:block">
            <m.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 origin-left rounded-full"
            />
            <m.div
              animate={{
                backgroundPosition: ['0% 0%', '200% 0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Steps */}
          <div className="process-cards-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative group flex h-full min-h-0 flex-col"
                >
                  <div className="section-mobile-card h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-[clamp(1rem,2vw,2rem)] backdrop-blur-lg transition-all duration-500 hover:border-white/30">
                    {/* Realistic 3D-style icon with glass/neon effect */}
                    <div className="relative mb-6 flex justify-center">
                      {/* Glow effect behind icon */}
                      <m.div
                        animate={hoveredIndex === index ? {
                          boxShadow: [
                            `0 0 20px ${step.color}60`,
                            `0 0 40px ${step.color}80`,
                            `0 0 20px ${step.color}60`,
                          ],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl blur-xl"
                        style={{ backgroundColor: `${step.color}30` }}
                      />
                      
                      {/* Realistic 3D icon container with depth */}
                      <m.div
                        whileHover={{ scale: 1.1, rotateY: 10 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}40, ${step.color}20)`,
                          boxShadow: `
                            0 8px 32px ${step.color}40,
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                          `,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        {/* Glass reflection overlay */}
                        <div 
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
                          }}
                        />
                        
                        {/* Icon with glow */}
                        <m.div
                          animate={hoveredIndex === index ? {
                            filter: [
                              `drop-shadow(0 0 8px ${step.color})`,
                              `drop-shadow(0 0 16px ${step.color})`,
                              `drop-shadow(0 0 8px ${step.color})`,
                            ],
                          } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Icon 
                            className="w-12 h-12 relative z-10" 
                            style={{ color: step.color, filter: 'brightness(1.3)' }}
                            strokeWidth={1.5}
                          />
                        </m.div>

                        {/* Inner highlight for 3D depth */}
                        <div 
                          className="absolute top-2 left-2 w-8 h-8 rounded-full opacity-50 blur-sm"
                          style={{ background: 'rgba(255, 255, 255, 0.4)' }}
                        />
                      </m.div>

                      {/* Soft glow on hover - light pulse effect */}
                      {hoveredIndex === index && (
                        <m.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 rounded-2xl blur-2xl -z-10"
                          style={{ backgroundColor: `${step.color}40` }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3 text-center">
                      <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] leading-relaxed text-cyan-100/70">
                        {step.description}
                      </p>
                    </div>

                    {/* Step number badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>

                    {/* Hover glow effect around card */}
                    <m.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${step.color}20, transparent 70%)`,
                      }}
                    />
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>

        {/* Quality badge */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-[clamp(2rem,5vh,4rem)] text-center"
        >
          <div className="inline-flex flex-wrap items-center gap-[clamp(0.75rem,2vw,1rem)] rounded-full border border-white/20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2vh,1rem)] backdrop-blur-lg">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white">
              ISO 9001:2015 Certified Process
            </span>
          </div>
        </m.div>
      </div>
    </section>
  );
}
