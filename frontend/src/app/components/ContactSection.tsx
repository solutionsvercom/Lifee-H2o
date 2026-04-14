import { m, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Phone, Mail, MapPin, Download } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { apiUrl } from "../utils/apiUrl";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 12000;

/** Served from `frontend/public/file/Brochure.pdf` → URL path `/file/Brochure.pdf`. */
const BROCHURE_PDF_HREF = `${import.meta.env.BASE_URL}file/Lifee_Water_Card.pdf`;

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const whatsappPhoneNumber = "919244372603";
  const whatsappMessage = "Hello, I am interested in your service";
  const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
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
  const resetContactForm = useCallback(() => {
    setFormData({ name: "", email: "", phone: "", location: "", requirement: "" });
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
        const response = await fetch(apiUrl("/api/email/contact"), {
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
          resetContactForm();
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
    [formData, resetContactForm]
  );

  return (
    <section 
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#0A2540] scroll-mt-20"
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
            delay: 0.3,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      <div className="section-container container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-[clamp(2rem,5vh,4rem)] text-center"
        >
          <h2 className="mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
            Get In{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100/80">
            Ready to experience premium hydration? Contact us for orders or distribution inquiries
          </p>
        </m.div>

        <div className="contact-grid">
          {/* Contact Form - Glassmorphism */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto w-full max-w-[min(100%,560px)]">
              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-[clamp(1rem,2vw,2rem)] shadow-2xl backdrop-blur-lg">
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
                  <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/90">Full Name</label>
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
                  <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/90">Phone Number</label>
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
                  <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/90">Email</label>
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
                  <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/90">Location</label>
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
                  <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/90">Requirement</label>
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-4 text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:shadow-cyan-500/70 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="w-5 h-5" />
                  {loading ? "Sending..." : "Send Message"}
                </m.button>
                {status.startsWith("success") && (
                  <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-green-400">✅ Message sent successfully!</p>
                )}
                {status.startsWith("error") && (
                  <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-red-400">❌ {status.replace(/^error:\s*/i, "")}</p>
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
                info: "+91 92443 72603",
                subinfo: "Mon-Sat, 9AM - 6PM",
              },
              {
                icon: Mail,
                title: "Email Us",
                info: "bipinbatham7@gmail.com",
                subinfo: "We'll respond within 24 hours",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                info: "Infront New Police Line Lahar Chungi Bhind, Madhya Pradesh 477001",
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
                      <h3 className="mb-1 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">{contact.title}</h3>
                      <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-300">{contact.info}</p>
                      <p className="mt-1 text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/50">{contact.subinfo}</p>
                    </div>
                  </div>
                </m.div>
              );
            })}

            {/* Quick links */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="pt-6"
            >
              <h3 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Quick Actions</h3>
              <div className="space-y-3">
                <m.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 p-4 text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:brightness-110 hover:shadow-green-500/50"
                >
                  <FaWhatsapp size={20} color="#FFFFFF" />
                  WhatsApp Us
                </m.a>
                
                <m.a
                  href={BROCHURE_PDF_HREF}
                  download="Lifee_Water_Card.pdf"
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 p-4 text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Download className="w-5 h-5 shrink-0" />
                  Download Visiting Card
                </m.a>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>

      {/* WhatsApp floating button — always visible (not gated on section in-view) */}
      <m.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 right-4 z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl shadow-green-500/50 transition-all hover:brightness-110 hover:shadow-green-500/70 group sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
      >
        <m.div
          aria-hidden
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-green-500"
        />
        <FaWhatsapp className="relative z-10 h-7 w-7 text-white sm:h-8 sm:w-8" />

        <div className="pointer-events-none absolute right-full z-10 mr-3 whitespace-nowrap rounded-lg bg-black/80 px-3 py-2 text-[clamp(0.75rem,1.2vw,0.95rem)] text-white opacity-0 transition-opacity group-hover:opacity-100">
          Chat with us on WhatsApp
        </div>
      </m.a>
    </section>
  );
}
