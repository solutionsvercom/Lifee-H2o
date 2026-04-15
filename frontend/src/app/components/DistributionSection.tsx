import { m, useInView } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { API_ENDPOINTS } from "../../config/api";
import { MADHYA_PRADESH_MAP_PATH } from "../data/madhyaPradeshOutlinePath";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 30000;

/** City markers: lon/lat projected to same bbox as MADHYA_PRADESH_MAP_PATH (%) */
const cities = [
  { name: "Bhopal", x: 38.56, y: 62.17 },
  { name: "Indore", x: 20.86, y: 71.52 },
  { name: "Jabalpur", x: 67.87, y: 63.53 },
  { name: "Gwalior", x: 47.33, y: 10.95 },
  { name: "Ujjain", x: 20.07, y: 63.61 },
  { name: "Sagar", x: 53.65, y: 52.15 },
  { name: "Dewas", x: 23.09, y: 67.23 },
  { name: "Ratlam", x: 11.52, y: 60.88 },
];

export function DistributionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  /** Dots biased toward interior of state (avoid western / northern spurs) */
  const decorativeDotLayout = useMemo(
    () =>
      [...Array(4)].map(() => ({
        top: `${22 + Math.random() * 56}%`,
        left: `${18 + Math.random() * 62}%`,
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
  const resetDistributorForm = useCallback(() => {
    setFormData({ name: "", email: "", phone: "", city: "", businessName: "" });
  }, []);

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
        const response = await fetch(API_ENDPOINTS.distributor, {
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
          resetDistributorForm();
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
    [formData, loading, resetDistributorForm]
  );

  return (
    <section
      id="distribution"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-slate-900 to-[#0A2540] scroll-mt-24"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="dist-section-grid-bg absolute inset-0" />
      </div>

      <div className="section-container container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        <div className="mx-auto grid w-full max-w-[min(100%,1100px)] items-center gap-[clamp(1rem,3vw,3rem)] [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
          {/* Left content */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
                Join Our Growing{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Distribution Network
                </span>
              </h2>
              <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] leading-relaxed text-cyan-100/80">
                Bring premium hydration to every corner of Madhya Pradesh.
                Partner with us and grow your business with a trusted brand.
              </p>
            </div>

            {/* Stats */}
            <div className="dist-stats-grid">
              {[
                { icon: Users, value: "50+", label: "Distributors" },
                { icon: MapPin, value: "5+", label: "Cities" },
                { icon: TrendingUp, value: "95%", label: "Growth Rate" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="section-mobile-card rounded-xl border border-white/10 bg-white/5 p-[clamp(0.75rem,2vw,1rem)] text-center backdrop-blur-sm"
                  >
                    <Icon className="mx-auto mb-2 h-6 w-6 text-cyan-400" />
                    <div className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold text-white">{stat.value}</div>
                    <div className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/60">{stat.label}</div>
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
                    transition={{ delay: 0.3, duration: 0.5 }}
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
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowForm(true);
                  setStatus("");
                }}
                disabled={loading}
                className="max-md:mb-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2vh,1rem)] text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:shadow-cyan-500/70"
              >
                {loading ? "Sending..." : "Become a Distributor"}
              </m.button>
            ) : (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative mx-auto w-full max-w-[min(100%,560px)] rounded-3xl border border-white/20 bg-white/10 p-[clamp(1rem,2vw,2rem)] shadow-2xl backdrop-blur-lg"
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
                    <m.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Submit Request"}
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
            className="relative max-md:mt-8"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Map container */}
              <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/5 p-6 backdrop-blur-lg max-md:p-4">
                {/* Simplified MP state outline */}
                <svg
                  viewBox="0 0 400 400"
                  className="h-full w-full [filter:drop-shadow(0_0_20px_rgba(14,165,233,0.3))]"
                >
                  {/* Madhya Pradesh outline (stylized) */}
                  <m.path
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d={MADHYA_PRADESH_MAP_PATH}
                    fill="none"
                    stroke="url(#mapGradient)"
                    strokeWidth="2"
                    strokeLinejoin="miter"
                    strokeMiterlimit="1.2"
                    strokeLinecap="butt"
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
                    transition={{ delay: 0.3, duration: 1 }}
                    d={MADHYA_PRADESH_MAP_PATH}
                    fill="url(#mapGradient)"
                  />
                </svg>

                {/* City nodes */}
                {cities.map((city, i) => (
                  <m.div
                    key={city.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${city.x}%`,
                      top: `${city.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Pulsing effect — smaller on mobile so glow stays inside card */}
                    <m.div
                      animate={{
                        scale: [1, 1.35, 1],
                        opacity: [0.45, 0, 0.45],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 max-md:h-3 max-md:w-3 max-md:opacity-80"
                    />

                    {/* Node */}
                    <m.div
                      whileHover={{ scale: 1.5 }}
                      className="relative z-[1] h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/40 max-md:h-1.5 max-md:w-1.5 max-md:shadow-sm"
                    />

                    {/* City label */}
                    <m.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none"
                    >
                      {city.name}
                    </m.div>

                    {/* Connection lines — hidden on mobile (long lines escape the boundary) */}
                    {i > 0 && (
                      <m.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="absolute top-1/2 right-full hidden h-px origin-right bg-gradient-to-r from-cyan-400/50 to-transparent md:block"
                        style={{ width: "36px" }}
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
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl"
                />

                {/* Decorative micro-dots — inside map card, small on mobile */}
                {decorativeDotLayout.map((pos, i) => (
                  <m.div
                    key={`dist-decor-${i}`}
                    animate={{
                      y: [-4, 4, -4],
                      opacity: [0.25, 0.45, 0.25],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    className="pointer-events-none absolute h-1 w-1 rounded-full bg-cyan-400 max-md:h-0.5 max-md:w-0.5 max-md:blur-[0.5px] md:h-1.5 md:w-1.5 md:blur-[1px]"
                    style={pos}
                  />
                ))}
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}