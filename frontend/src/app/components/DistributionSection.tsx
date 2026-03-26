import { m, useInView } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Users, TrendingUp } from "lucide-react";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 12000;

const cities = [
  { name: "Bhopal", x: 50, y: 45 },
  { name: "Indore", x: 35, y: 60 },
  { name: "Jabalpur", x: 70, y: 40 },
  { name: "Gwalior", x: 60, y: 20 },
  { name: "Ujjain", x: 30, y: 55 },
  { name: "Sagar", x: 55, y: 50 },
  { name: "Dewas", x: 40, y: 50 },
  { name: "Ratlam", x: 25, y: 55 },
];

export function DistributionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const decorativeDotLayout = useMemo(
    () =>
      [...Array(4)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      })),
    []
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    businessName: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const fetchAbortRef = useRef<AbortController | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      fetchAbortRef.current?.abort();
      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!status) return;
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      setStatus("");
    }, STATUS_HIDE_MS);
  }, [status]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;

      if (!formData.name || !formData.email || !formData.phone) {
        setStatus("error: Name, email and phone are required.");
        return;
      }

      fetchAbortRef.current?.abort();
      const ac = new AbortController();
      fetchAbortRef.current = ac;
      setLoading(true);
      setStatus("");
      let didTimeout = false;
      const requestTimeout = window.setTimeout(() => {
        didTimeout = true;
        ac.abort();
      }, REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch("http://localhost:5000/api/email/distributor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            businessName: formData.businessName,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setStatus("success: Distributor request sent successfully!");
          setFormData({ name: "", email: "", phone: "", city: "", businessName: "" });
          setShowForm(false);
        } else {
          setStatus("error: " + (data.error || "Failed to submit distributor request"));
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError" && !didTimeout) return;
        if (didTimeout) {
          setStatus("error: Request timed out. Please try again.");
          return;
        }
        setStatus("error: Cannot connect to server");
      } finally {
        window.clearTimeout(requestTimeout);
        setLoading(false);
      }
    },
    [formData, loading]
  );

  return (
    <section
      id="distribution"
      ref={ref}
      className="relative py-16 px-4 sm:px-6 bg-gradient-to-br from-[#0A2540] via-slate-900 to-[#0A2540] overflow-hidden scroll-mt-24"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Left content */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-bold text-white leading-tight">
                Join Our Growing{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Distribution Network
                </span>
              </h2>
              <p className="text-lg text-cyan-100/80 leading-relaxed">
                Bring premium hydration to every corner of Madhya Pradesh.
                Partner with us and grow your business with a trusted brand.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Users, value: "500+", label: "Distributors" },
                { icon: MapPin, value: "50+", label: "Cities" },
                { icon: TrendingUp, value: "95%", label: "Growth Rate" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center"
                  >
                    <Icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-cyan-100/60">{stat.label}</div>
                  </m.div>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                "Lucrative profit margins",
                "Marketing & promotional support",
                "Exclusive territory rights",
                "Training & technical assistance",
              ].map((benefit, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-cyan-100/80"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  {benefit}
                </m.div>
              ))}
            </div>

            {/* CTA / Form */}
            {!showForm ? (
              <m.button
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowForm(true);
                  setStatus("");
                }}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300"
              >
                {loading ? "Sending..." : "Become a Distributor"}
              </m.button>
            ) : (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
                style={{
                  maxWidth: "560px",
                  width: "100%",
                  margin: "0 auto",
                }}
                className="relative p-5 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <m.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"
                />

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-white/90 text-sm">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm">Business Name</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Enter your business name"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <m.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Submit Request"}
                    </m.button>

                    <m.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowForm(false);
                        setStatus("");
                      }}
                      className="flex-1 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                      Cancel
                    </m.button>
                  </div>
                </form>
              </m.div>
            )}

            {status.startsWith("success") && (
              <p className="text-green-400">✅ Distributor request sent successfully!</p>
            )}
            {status.startsWith("error") && (
              <p className="text-red-400">❌ {status.replace(/^error:\s*/i, "")}</p>
            )}
          </m.div>

          {/* Right - Futuristic MP Map */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Map container */}
              <div className="relative w-full h-full p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10">
                {/* Simplified MP state outline */}
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full"
                  style={{ filter: "drop-shadow(0 0 20px rgba(14, 165, 233, 0.3))" }}
                >
                  {/* MP state shape (simplified) */}
                  <m.path
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M 100 50 L 300 50 L 350 100 L 350 250 L 300 300 L 200 320 L 100 300 L 50 250 L 50 100 Z"
                    fill="none"
                    stroke="url(#mapGradient)"
                    strokeWidth="3"
                  />
                  <defs>
                    <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>

                  {/* Fill with pattern */}
                  <m.path
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.1 } : {}}
                    transition={{ delay: 1, duration: 1 }}
                    d="M 100 50 L 300 50 L 350 100 L 350 250 L 300 300 L 200 320 L 100 300 L 50 250 L 50 100 Z"
                    fill="url(#mapGradient)"
                  />
                </svg>

                {/* City nodes */}
                {cities.map((city, i) => (
                  <m.div
                    key={city.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1 + i * 0.15, type: "spring" }}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${city.x}%`,
                      top: `${city.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Pulsing effect */}
                    <m.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
                    />

                    {/* Node */}
                    <m.div
                      whileHover={{ scale: 1.5 }}
                      className="relative w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                    />

                    {/* City label */}
                    <m.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none"
                    >
                      {city.name}
                    </m.div>

                    {/* Connection lines */}
                    {i > 0 && (
                      <m.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                        className="absolute top-1/2 right-full h-px bg-gradient-to-r from-cyan-400/50 to-transparent origin-right"
                        style={{ width: "50px" }}
                      />
                    )}
                  </m.div>
                ))}

                {/* Glowing effect */}
                <m.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl blur-2xl pointer-events-none"
                />
              </div>

              {/* Decorative elements */}
              {decorativeDotLayout.map((pos, i) => (
                <m.div
                  key={`dist-decor-${i}`}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm"
                  style={pos}
                />
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}