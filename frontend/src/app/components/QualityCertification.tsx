import { m, useInView } from "motion/react";
import { useRef } from "react";
import { Award, ShieldCheck, FlaskConical, BadgeCheck } from "lucide-react";

const certifications = [
  {
    icon: BadgeCheck,
    title: "BIS Certified",
    description: "Bureau of Indian Standards approved",
  },
  {
    icon: ShieldCheck,
    title: "FSSAI Approved",
    description: "Food Safety and Standards Authority certified",
  },
  {
    icon: FlaskConical,
    title: "Multi-level Testing",
    description: "Rigorous quality control at every stage",
  },
  {
    icon: Award,
    title: "ISO Certified",
    description: "International quality management standards",
  },
];

export function QualityCertification() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="certifications"
      ref={ref}
      className="relative py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-[#0A2540] to-slate-900 scroll-mt-24"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230EA5E9' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <m.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <h2 className="text-[clamp(2rem,7vw,3.75rem)] font-bold text-white mb-6 leading-tight">
              Tested. Certified.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Trusted.
              </span>
            </h2>
          </m.div>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Our commitment to quality is backed by multiple certifications and rigorous testing protocols
          </p>
        </m.div>

        {/* Certifications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-2xl h-full">
                  {/* Glow effect */}
                  <m.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity"
                  />

                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Icon with glow */}
                    <m.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className="relative"
                    >
                      <m.div
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(14, 165, 233, 0.5)',
                            '0 0 40px rgba(14, 165, 233, 0.8)',
                            '0 0 20px rgba(14, 165, 233, 0.5)',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </m.div>

                      {/* Badge checkmark */}
                      <m.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </m.div>
                    </m.div>

                    {/* Text */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-cyan-100/70">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <m.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                   delay: 1,
                }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                100+
              </m.div>
              <p className="text-cyan-100/70">Quality Tests Daily</p>
            </div>
            <div className="space-y-2">
              <m.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1,
                }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                99.9%
              </m.div>
              <p className="text-cyan-100/70">Purity Guaranteed</p>
            </div>
            <div className="space-y-2">
              <m.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1,
                }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                24/7
              </m.div>
              <p className="text-cyan-100/70">Quality Monitoring</p>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
