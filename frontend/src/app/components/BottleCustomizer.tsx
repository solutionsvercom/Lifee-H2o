import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Upload, Building2, Cake, Heart } from "lucide-react";

type OccasionType = "wedding" | "corporate" | "birthday" | null;
type LabelFinish = "matte" | "glossy";

const occasions = [
  {
    id: "wedding" as const,
    icon: Heart,
    title: "Wedding",
    description: "Elegant personalized bottles for your special day",
    theme: "Gold/White Luxury",
    backgroundImage:
      "https://images.unsplash.com/photo-1761574044344-394d47e1a96c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMGNlcmVtb255JTIwYnJpZGUlMjBncm9vbXxlbnwxfHx8fDE3NzM3NzkzNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bottleImage:
      "https://images.unsplash.com/photo-1760043186309-69c11f4c08ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2F0ZXIlMjBib3R0bGUlMjBzdHVkaW8lMjBsaWdodGluZ3xlbnwxfHx8fDE3NzM3NzkzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    labelText: "Aarav ❤️ Meera",
    labelSubtext: "12 December 2026",
    colors: { primary: "#D4AF37", secondary: "#FFFFFF", text: "#000000" },
  },
  {
    id: "corporate" as const,
    icon: Building2,
    title: "Corporate",
    description: "Professional branded bottles for your business",
    theme: "Clean Minimal",
    backgroundImage:
      "https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzM3NzkzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bottleImage:
      "https://images.unsplash.com/photo-1616118132534-381148898bb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsaXN0aWMlMjBwbGFzdGljJTIwd2F0ZXIlMjBib3R0bGUlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzczNzc5MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    labelText: "Vercom Solutions",
    labelSubtext: "Excellence in Every Drop",
    colors: { primary: "#0EA5E9", secondary: "#FFFFFF", text: "#FFFFFF" },
  },
  {
    id: "birthday" as const,
    icon: Cake,
    title: "Birthday",
    description: "Vibrant custom bottles for birthday celebrations",
    theme: "Soft Vibrant",
    backgroundImage:
      "https://images.unsplash.com/photo-1721804812395-12c7c963ca52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzM2ODA5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bottleImage:
      "https://images.unsplash.com/photo-1670201202862-96b9c3d11375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsaXN0aWMlMjB3YXRlciUyMGJvdHRsZSUyMHRyYW5zcGFyZW50JTIwcGxhc3RpYyUyMGNvbmRlbnNhdGlvbnxlbnwxfHx8fDE3NzM3NzkzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    labelText: "Happy Birthday Riya 🎉",
    labelSubtext: "Sweet 16",
    colors: { primary: "#EC4899", secondary: "#FDE047", text: "#FFFFFF" },
  },
];

export function BottleCustomizer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>(null);
  const [customData, setCustomData] = useState({
    image: "",
    name: "",
    eventDate: "",
    message: "",
    finish: "glossy" as LabelFinish,
    quantity: 50,
    location: "",
  });
  const [rotation, setRotation] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomData({ ...customData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTheme = selectedOccasion ? occasions.find((o) => o.id === selectedOccasion)?.colors : null;
  const currentOccasion = selectedOccasion ? occasions.find((o) => o.id === selectedOccasion) : null;

  return (
    <section
      id="customizer"
      ref={ref}
      className="relative py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-[#0A2540] overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.3) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-bold text-white mb-6 leading-tight">
            Craft Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Signature Bottle</span>
          </h2>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Personalize premium water bottles with precision-designed labels for your special moments.
          </p>
        </motion.div>

        {!selectedOccasion ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {occasions.map((occasion, index) => {
              const Icon = occasion.icon;
              return (
                <motion.div
                  key={occasion.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  onClick={() => setSelectedOccasion(occasion.id)}
                  className="group cursor-pointer"
                >
                  <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 transition-all duration-500">
                    <div className="relative h-80 overflow-hidden">
                      <motion.img
                        src={occasion.backgroundImage}
                        alt={`${occasion.title} scene`}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />

                      <div className="absolute inset-0 flex items-end justify-center pb-8">
                        <motion.div whileHover={{ scale: 1.1, y: -10 }} transition={{ duration: 0.4 }} className="relative" style={{ filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))" }}>
                          <div className="relative w-32 h-48">
                            <img src={occasion.bottleImage} alt={`${occasion.title} bottle`} className="w-full h-full object-contain" />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${occasion.colors.primary}20` }}>
                          <Icon className="w-6 h-6" style={{ color: occasion.colors.primary }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{occasion.title}</h3>
                          <p className="text-xs text-cyan-100/50">{occasion.theme}</p>
                        </div>
                      </div>

                      <p className="text-cyan-100/70 text-sm">{occasion.description}</p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-4"
                        style={{
                          background: `linear-gradient(135deg, ${occasion.colors.primary}, ${occasion.colors.secondary})`,
                          color: occasion.id === "wedding" || occasion.id === "corporate" ? (occasion.id === "wedding" ? "#000" : "#fff") : "#000",
                        }}
                      >
                        Customize Now
                      </motion.button>
                    </div>

                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${occasion.colors.primary}20, transparent 70%)` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              <div className="relative">
                <div className="sticky top-8">
                  <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 p-5 sm:p-8 lg:p-12 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                    <motion.div
                      animate={{ rotateY: rotation }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="relative cursor-grab active:cursor-grabbing"
                      style={{ transformStyle: "preserve-3d" }}
                      drag="x"
                      onDrag={(_, info) => {
                        setRotation((r) => r + info.delta.x * 0.5);
                      }}
                    >
                      <RealisticCustomBottle
                        labelColor={currentTheme?.primary || "#0EA5E9"}
                        labelSecondary={currentTheme?.secondary || "#FFFFFF"}
                        labelTextColor={currentTheme?.text || "#FFFFFF"}
                        text={customData.name || currentOccasion?.labelText || ""}
                        subtext={customData.eventDate || currentOccasion?.labelSubtext || ""}
                        message={customData.message}
                        image={customData.image}
                        finish={customData.finish}
                      />
                    </motion.div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                      <p className="text-cyan-100/60 text-sm">Drag to rotate • Changes update in real-time</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <motion.button onClick={() => setSelectedOccasion(null)} whileHover={{ x: -5 }} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mb-4">
                  ← Back to occasions
                </motion.button>

                <div className="p-5 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-6">
                  <div className="space-y-3">
                    <label className="text-white font-semibold">Upload Image</label>
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/30 hover:border-cyan-400 transition-all cursor-pointer bg-white/5 hover:bg-white/10"
                      >
                        <Upload className="w-6 h-6 text-cyan-400" />
                        <span className="text-white">{customData.image ? "Change Image" : "Upload High-Res Photo"}</span>
                      </label>
                    </div>
                    {customData.image && <img src={customData.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />}
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Name(s)</label>
                    <input
                      type="text"
                      value={customData.name}
                      onChange={(e) => setCustomData({ ...customData, name: e.target.value })}
                      placeholder={selectedOccasion === "wedding" ? "John & Jane" : "Enter name"}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Event Date</label>
                    <input
                      type="date"
                      value={customData.eventDate}
                      onChange={(e) => setCustomData({ ...customData, eventDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Custom Message</label>
                    <textarea
                      value={customData.message}
                      onChange={(e) => setCustomData({ ...customData, message: e.target.value })}
                      placeholder="Add a special message..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Label Finish</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(["matte", "glossy"] as const).map((finish) => (
                        <motion.button
                          key={finish}
                          onClick={() => setCustomData({ ...customData, finish })}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            customData.finish === finish ? "border-cyan-400 bg-cyan-400/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-white font-semibold capitalize">{finish}</div>
                          <div className="text-xs text-cyan-100/60 mt-1">{finish === "matte" ? "Soft, elegant look" : "Shiny, premium feel"}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h3 className="text-white font-semibold text-lg">Order Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-white text-sm">Quantity</label>
                        <input
                          type="number"
                          value={customData.quantity}
                          onChange={(e) => setCustomData({ ...customData, quantity: parseInt(e.target.value || "0") })}
                          min="25"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white text-sm">Delivery Location</label>
                        <input
                          type="text"
                          value={customData.location}
                          onChange={(e) => setCustomData({ ...customData, location: e.target.value })}
                          placeholder="City"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block mx-auto w-full max-w-[300px] py-4 px-6 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
                    >
                      Request Custom Order
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

interface RealisticCustomBottleProps {
  labelColor: string;
  labelSecondary: string;
  labelTextColor: string;
  text?: string;
  subtext?: string;
  message?: string;
  image?: string;
  finish: LabelFinish;
}

function RealisticCustomBottle({
  labelColor,
  labelSecondary,
  labelTextColor,
  text,
  subtext,
  message,
  image,
  finish,
}: RealisticCustomBottleProps) {
  return (
    <div className="relative w-[clamp(150px,45vw,220px)] aspect-[2/5]" style={{ filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4))" }}>
      <svg
        viewBox="0 0 220 550"
        className="w-full h-full"
        style={{
          filter: finish === "glossy" ? "drop-shadow(0 0 30px rgba(14, 165, 233, 0.4))" : "drop-shadow(0 0 15px rgba(14, 165, 233, 0.2))",
        }}
      >
        <defs>
          <linearGradient id="customBottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#B3E5FC" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E0F7FF" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="customWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B3E5FC" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#81D4FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="customLabel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={labelColor} stopOpacity={finish === "glossy" ? "0.95" : "0.85"} />
            <stop offset="100%" stopColor={labelSecondary} stopOpacity={finish === "glossy" ? "1" : "0.9"} />
          </linearGradient>
          <linearGradient id="customShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={finish === "glossy" ? "0.9" : "0.5"} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <clipPath id="labelClip">
            <rect x="65" y="240" width="90" height="140" rx="8" />
          </clipPath>
        </defs>

        <rect x="70" y="25" width="80" height="40" rx="6" fill="#1E40AF" />
        <ellipse cx="110" cy="25" rx="40" ry="12" fill="#2563EB" />
        <ellipse cx="110" cy="28" rx="37" ry="10" fill="#3B82F6" />
        <path d="M 80 65 L 70 85 L 70 115 L 150 115 L 150 85 L 140 65 Z" fill="url(#customBottleGlass)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
        <rect x="60" y="115" width="100" height="400" rx="22" fill="url(#customBottleGlass)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        <rect x="63" y="145" width="94" height="360" rx="20" fill="url(#customWater)" />
        <rect x="65" y="240" width="90" height="140" rx="8" fill="url(#customLabel)" opacity={finish === "glossy" ? "0.95" : "0.85"} />

        {image && <image href={image} x="70" y="250" width="80" height="50" clipPath="url(#labelClip)" preserveAspectRatio="xMidYMid slice" opacity="0.3" />}
        {text && (
          <text x="110" y="325" textAnchor="middle" fill={labelTextColor} fontSize="12" fontWeight="bold">
            {text.substring(0, 15)}
          </text>
        )}
        {subtext && (
          <text x="110" y="345" textAnchor="middle" fill={labelTextColor} fontSize="8" opacity="0.9">
            {subtext.substring(0, 20)}
          </text>
        )}
        {message && (
          <text x="110" y="365" textAnchor="middle" fill={labelTextColor} fontSize="7" opacity="0.8">
            {message.substring(0, 25)}
          </text>
        )}
      </svg>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "50%", height: 30, background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.4), transparent)", filter: "blur(12px)" }}
      />
    </div>
  );
}
