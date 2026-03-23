import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";


export function HeroSection() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bottleScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen overflow-hidden scroll-mt-24">
      {/* Animated Background - Dark aqua gradient */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0c3557] to-[#0A2540]"
      >
        {/* Animated waves */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='%230EA5E9' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>
      </motion.div>

      {/* Floating water droplets */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-cyan-300/60 rounded-full blur-[1px]"
          initial={{ 
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000, 
            y: -20,
            opacity: 0.6 
          }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000,
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}



      {/* Main content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-12 sm:pb-16"
      >
        {/* Large center-focused hyper-realistic 3D bottle */}
        <motion.div
          style={{
            scale: bottleScale,
            perspective: "600px",
            perspectiveOrigin: "center center",
          }}
          className="relative mb-8 max-w-full overflow-visible"
        >
          {/* Soft glow around bottle */}
          <div className="absolute inset-0 bg-cyan-400/30 blur-[80px] scale-150" />
          <motion.div
            animate={{
              x: [-20, 0, 20, 0, -20],
              opacity: [0.6, 0.2, 0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,150,255,0.3) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />
          
          {/* Studio lighting effect */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl" />

          {/* Realistic 3D Bottle with smooth 360° rotation */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{
                scaleX: [1, 0.08, 1, 0.08, 1],
                rotateY: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
              className="relative flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <motion.div
                animate={{
                  opacity: [0.6, 0.1, 0.6, 0.1, 0.6],
                  scaleX: [1, 0.1, 1, 0.1, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  borderRadius: "50%",
                }}
              />
              <div className="w-[clamp(160px,45vw,240px)]">
                <RealisticLifeeBottle />
              </div>
            </motion.div>
          </motion.div>

          {/* Water droplets falling from bottle */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-3 bg-gradient-to-b from-cyan-200/80 to-cyan-300/60 rounded-full blur-[0.5px]"
              style={{
                left: `${30 + i * 10}%`,
                top: '85%',
              }}
              animate={{
                y: [0, 100],
                opacity: [0.8, 0],
                scaleY: [1, 1.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeIn",
              }}
            />
          ))}
        </motion.div>

        {/* Premium Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center max-w-4xl space-y-5 sm:space-y-6"
        >
          <motion.h1 
            className="text-[clamp(2rem,8vw,4.5rem)] font-bold text-white tracking-tight leading-tight"
            style={{
              textShadow: '0 0 40px rgba(14, 165, 233, 0.5)',
            }}
          >
            Purity Engineered.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Hydration Perfected.
            </span>
          </motion.h1>

          <p className="text-[clamp(1rem,3vw,1.25rem)] text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            Crafted with advanced purification technology, delivering unmatched 
            freshness and safety in every drop across Madhya Pradesh.
          </p>

        </motion.div>

       
      </motion.div>

      {/* Glassmorphic overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </section>
  );
}

// Hyper-realistic LIFEE bottle component with condensation and water effects
function RealisticLifeeBottle() {
  return (
    <div 
      className="relative w-full aspect-[1/3]"
      style={{ 
        filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4))',
      }}
    >
      <svg
        viewBox="0 0 200 500"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(14, 165, 233, 0.4))',
        }}
      >
        <defs>
          {/* Ultra-realistic gradients */}
          <linearGradient id="bottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#B3E5FC" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#81D4FA" stopOpacity="0.15" />
            <stop offset="65%" stopColor="#B3E5FC" stopOpacity="0.20" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
          </linearGradient>

          {/* Water inside gradient */}
          <linearGradient id="waterInside" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#B3E5FC" stopOpacity="0.90" />
            <stop offset="60%" stopColor="#7DD3FC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.90" />
          </linearGradient>

          {/* Bottle edge shadow for 3D depth */}
          <linearGradient id="bottleEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="10%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="90%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.20" />
          </linearGradient>

          {/* Center highlight */}
          <radialGradient id="centerGlow" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Label gradient */}
          <linearGradient id="labelBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
          </linearGradient>

          {/* Shine effect for realistic lighting */}
          <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="capTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Condensation pattern */}
          <filter id="condensation">
            <feTurbulence baseFrequency="0.05" numOctaves="3" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </defs>

        <rect x="68" y="22" width="64" height="33" rx="6" fill="url(#capGrad)" />
        <ellipse cx="100" cy="22" rx="32" ry="10" fill="url(#capTop)" />
        <ellipse cx="100" cy="55" rx="33" ry="5" fill="#1E3A8A" opacity="0.8" />
        <ellipse cx="88" cy="28" rx="14" ry="5" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="92" cy="18" rx="8" ry="4" fill="rgba(255,255,255,0.6)" />

        {/* Bottle neck */}
        <path
          d="M 78 55 L 68 75 L 65 100 L 135 100 L 132 75 L 122 55 Z"
          fill="url(#bottleGlass)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <path
          d="M 78 55 L 70 75 L 68 100 L 80 100 L 82 75 L 84 55 Z"
          fill="rgba(255,255,255,0.4)"
        />

        {/* Main bottle body - realistic shape */}
        <path
          d="M 65 100 C 55 100, 45 110, 45 125 L 45 380 C 45 400, 55 450, 65 460 L 135 460 C 145 450, 155 400, 155 380 L 155 125 C 155 110, 145 100, 135 100 Z"
          fill="url(#bottleGlass)"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Water inside bottle */}
        <path
          d="M 48 140 L 48 378 C 48 396, 57 445, 66 455 L 134 455 C 143 445, 152 396, 152 378 L 152 140 Z"
          fill="url(#waterInside)"
          opacity="0.85"
        />
        <path
          d="M 65 100 C 55 100, 45 110, 45 125 L 45 380 C 45 400, 55 450, 65 460 L 135 460 C 145 450, 155 400, 155 380 L 155 125 C 155 110, 145 100, 135 100 Z"
          fill="url(#bottleEdge)"
        />
        <path
          d="M 65 100 C 55 100, 45 110, 45 125 L 45 380 C 45 400, 55 450, 65 460 L 135 460 C 145 450, 155 400, 155 380 L 155 125 C 155 110, 145 100, 135 100 Z"
          fill="url(#centerGlow)"
        />

        {/* LIFEE Label */}
        <g>
          <rect
            x="60"
            y="220"
            width="80"
            height="120"
            rx="6"
            fill="url(#labelBg)"
            opacity="0.95"
          />
          
          {/* LIFEE text */}
          <text
            x="100"
            y="265"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="bold"
            letterSpacing="2"
          >
            LIFEE
          </text>

          {/* Premium Water subtext */}
          <text
            x="100"
            y="285"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8"
            opacity="0.9"
            letterSpacing="1"
          >
            PREMIUM WATER
          </text>

          {/* Decorative line */}
          <line x1="70" y1="295" x2="130" y2="295" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

          {/* Volume indicator */}
          <text
            x="100"
            y="315"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="600"
          >
            1L
          </text>

          {/* Additional text */}
          <text
            x="100"
            y="328"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="6"
            opacity="0.8"
          >
            PURE & NATURAL
          </text>
        </g>

        {/* Realistic shine/reflection - left side */}
        <ellipse
          cx="72"
          cy="160"
          rx="12"
          ry="80"
          fill="url(#shine)"
          opacity="0.7"
        />

        {/* Realistic shine - right side subtle */}
        <ellipse
          cx="130"
          cy="280"
          rx="8"
          ry="60"
          fill="rgba(255, 255, 255, 0.2)"
          opacity="0.5"
        />

        {/* Condensation droplets - chilled effect */}
        {[
          { cx: 68, cy: 150, r: 2 },
          { cx: 75, cy: 175, r: 1.5 },
          { cx: 70, cy: 195, r: 1 },
          { cx: 80, cy: 210, r: 2.5 },
          { cx: 132, cy: 165, r: 1.5 },
          { cx: 128, cy: 190, r: 2 },
          { cx: 135, cy: 215, r: 1 },
          { cx: 65, cy: 360, r: 1.5 },
          { cx: 72, cy: 380, r: 2 },
          { cx: 68, cy: 400, r: 1 },
          { cx: 130, cy: 350, r: 1.5 },
          { cx: 136, cy: 375, r: 1 },
          { cx: 133, cy: 395, r: 2 },
        ].map((drop, i) => (
          <g key={i}>
            <circle
              cx={drop.cx}
              cy={drop.cy}
              r={drop.r}
              fill="rgba(255, 255, 255, 0.6)"
              filter="blur(0.5px)"
            />
            <circle
              cx={drop.cx}
              cy={drop.cy}
              r={drop.r * 0.5}
              fill="rgba(255, 255, 255, 0.9)"
            />
          </g>
        ))}

        {/* Bottom curve highlight */}
        <ellipse
          cx="100"
          cy="440"
          rx="35"
          ry="8"
          fill="rgba(255, 255, 255, 0.15)"
        />

      </svg>
      <motion.div
        animate={{
          x: ["-120%", "0%", "120%", "0%", "-120%"],
          opacity: [0, 0.7, 0, 0.7, 0],
          scaleX: [0.3, 1, 0.3, 1, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.5) 50%, transparent 80%)",
          borderRadius: "8px",
        }}
      />

      {/* Realistic shadow beneath bottle */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '50%',
          height: 30,
          background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.4), transparent)',
          filter: 'blur(12px)',
        }}
      />
    </div>
  );
}