import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="about"
      ref={ref}
      className="relative min-h-screen flex items-center py-20 md:py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 scroll-mt-24"
    >
      {/* Flowing water visual */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={isInView ? { opacity: 0.2, scale: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute right-0 top-0 w-1/2 h-full"
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 blur-3xl"
        />
        <img
          src="https://images.unsplash.com/photo-1765605501047-f949141e505e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHdhdmUlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzM3NzY4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Water waves"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-bold text-white mb-6 leading-tight">
                Elegant{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Storytelling
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6 text-cyan-100/90 leading-relaxed"
            >
              <p className="text-lg">
                Our water is refined through{" "}
                <span className="text-cyan-300 font-semibold">
                  precision-driven purification systems
                </span>{" "}
                designed to deliver uncompromised quality.
              </p>
              <p className="text-lg">
                We don't just provide drinking water — we{" "}
                <span className="text-cyan-300 font-semibold">
                  engineer purity
                </span>
                .
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-4"
            >
              {[
                { value: "99.9%", label: "Pure" },
                { value: "0", label: "Impurities" },
                { value: "24/7", label: "Available" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-cyan-300/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(14, 165, 233, 0.3)',
                    '0 0 60px rgba(14, 165, 233, 0.5)',
                    '0 0 40px rgba(14, 165, 233, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-3xl"
              />
              <img
                src="/images/lifee-bottle1L.png"  
                alt="Natural water source"
                className="relative w-full h-auto rounded-2xl"
              />
            </div>

            {/* Floating elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className="absolute w-3 h-3 bg-cyan-400 rounded-full blur-sm"
                style={{
                  top: `${20 + i * 25}%`,
                  right: `${-5 + i * 3}%`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}