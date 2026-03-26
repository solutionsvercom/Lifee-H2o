import { m, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 12000;

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    requirement: "",
  });
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
        const response = await fetch("http://localhost:5000/api/email/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            message: formData.requirement,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success: Message sent successfully!");
          setFormData({ name: "", email: "", phone: "", location: "", requirement: "" });
        } else {
          setStatus("error: " + (data.error || "Failed to send message"));
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
    [formData]
  );

  return (
    <section 
      id="contact"
      ref={ref}
      className="relative py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-[#0A2540] overflow-hidden scroll-mt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <m.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"
        />
        <m.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 section-container">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-bold text-white mb-6 leading-tight">
            Get In{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Ready to experience premium hydration? Contact us for orders or distribution inquiries
          </p>
        </m.div>

        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Contact Form - Glassmorphism */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                maxWidth: "560px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <div className="relative p-5 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              {/* Glow effect */}
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
                  <label className="text-white/90 text-sm">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Your city in Madhya Pradesh"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm">Requirement</label>
                  <textarea
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    placeholder="Tell us about your requirement (order quantity, distribution inquiry, etc.)"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                    required
                  />
                </div>

                <m.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {loading ? "Sending..." : "Send Message"}
                </m.button>
                {status.startsWith("success") && (
                  <p className="text-sm text-green-400">✅ Message sent successfully!</p>
                )}
                {status.startsWith("error") && (
                  <p className="text-sm text-red-400">❌ {status.replace(/^error:\s*/i, "")}</p>
                )}
              </form>
              </div>
            </div>
          </m.div>

          {/* Contact Info */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Contact cards */}
            {[
              {
                icon: Phone,
                title: "Call Us",
                info: "+91 98765 43210",
                subinfo: "Mon-Sat, 9AM - 6PM",
              },
              {
                icon: Mail,
                title: "Email Us",
                info: "contact@premiumwater.com",
                subinfo: "We'll respond within 24 hours",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                info: "Bhopal, Madhya Pradesh",
                subinfo: "Corporate Office",
              },
            ].map((contact, i) => {
              const Icon = contact.icon;
              return (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{contact.title}</h3>
                      <p className="text-cyan-300">{contact.info}</p>
                      <p className="text-cyan-100/50 text-sm mt-1">{contact.subinfo}</p>
                    </div>
                  </div>
                </m.div>
              );
            })}

            {/* Quick links */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-6"
            >
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <m.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                >
                  <FaWhatsapp size={20} color="#FFFFFF" />
                  WhatsApp Us
                </m.button>
                
                <m.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  Download Brochure
                </m.button>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <m.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all z-30 group"
      >
        <FaWhatsapp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        
        {/* Pulsing effect */}
        <m.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-full bg-green-500"
        />

        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us on WhatsApp
        </div>
      </m.a>
    </section>
  );
}
