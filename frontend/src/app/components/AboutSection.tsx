import { m, useInView } from "motion/react";
import { useRef } from "react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="about"
      ref={ref}
      className="relative flex min-h-0 items-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 scroll-mt-20"
    >
      {/* Flowing water visual */}
      <m.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={isInView ? { opacity: 0.2, scale: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full md:inset-y-0 md:right-0 md:left-auto md:w-1/2"
      >
        <m.div
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
          width={1080}
          height={720}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
      </m.div>

      {/* Content */}
      <div className="container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        <div className="about-main-grid">
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-[clamp(1rem,3vw,3rem)] md:pr-[clamp(1rem,3vw,3rem)]"
          >
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center"
            >
              <h2 className="mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
                Elegant{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Storytelling
                </span>
              </h2>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-xl space-y-[clamp(1rem,2vh,1.5rem)] text-center leading-relaxed text-cyan-100/90"
            >
              <p className="text-[clamp(0.9rem,1.5vw,1.1rem)]">
                Our water is refined through{" "}
                <span className="text-cyan-300 font-semibold">
                  precision-driven purification systems
                </span>{" "}
                designed to deliver uncompromised quality.
              </p>
              <p className="text-[clamp(0.9rem,1.5vw,1.1rem)]">
                We don't just provide drinking water — we{" "}
                <span className="text-cyan-300 font-semibold">
                  engineer purity
                </span>
                .
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="about-stats-grid"
            >
              {[
                { value: "99%", label: "Pure" },
                { value: "0", label: "Impurities" },
                { value: "24/7", label: "Available" },
              ].map((stat, i) => (
                <div key={i} className="section-mobile-card text-center">
                  <div className="text-[clamp(1.25rem,3vw,2rem)] font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-300/70">{stat.label}</div>
                </div>
              ))}
            </m.div>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative mx-auto w-full max-w-[min(100%,440px)] rounded-3xl border border-white/10 bg-white/5 p-[clamp(1rem,2vw,2rem)] shadow-2xl backdrop-blur-lg">
              <m.div
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
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                className="relative w-full h-auto rounded-2xl"
              />
            </div>

            {/* Floating elements */}
            {[...Array(3)].map((_, i) => (
              <m.div
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
          </m.div>
        </div>
      </div>
    </section>
  );
}
