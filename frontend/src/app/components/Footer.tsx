import { m } from "motion/react";
import { Link } from "react-router";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0A2540] to-slate-950 px-[clamp(1rem,5vw,5rem)] pb-[clamp(1.5rem,4vh,2rem)] pt-[clamp(2.5rem,6vh,4rem)] text-white">
      {/* Wave divider */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <m.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      <div className="section-container container mx-auto w-full max-w-[min(100%,1400px)]">
        <div className="footer-grid mb-[clamp(2rem,5vh,3rem)] grid grid-cols-1 gap-[clamp(1rem,3vw,3rem)] md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="footer-brand space-y-4">
            <m.div
              animate={{
                filter: ['drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))', 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))', 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="footer-brand-title flex items-center gap-3"
            >
              <div className="text-4xl">💧</div>
              <div className="text-left">
                <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold">Lifee Packaged Drinking Water</h3>
                <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-400">Purity Engineered.</p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.78rem',
                    color: 'rgba(34,211,238,0.7)',
                    fontFamily: 'serif',
                    fontStyle: 'italic',
                    letterSpacing: '0.02em',
                  }}
                >
                  भरोसा शुद्धता का, एहसास ताज़गी का
                </p>
              </div>
            </m.div>
            <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70">
              Advanced purification technology delivering unmatched freshness and safety across Madhya Pradesh.
            </p>
            
            {/* Social links */}
            <div className="social-icons flex gap-3 pt-4">
              {[
                // { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://www.instagram.com/lifee8516?igsh=MTJ6Zmljbndxd2drdQ==" },
                // { Icon: Twitter, href: "https://x.com" },
                // { Icon: Linkedin, href: "https://linkedin.com" },
                // { Icon: Youtube, href: "https://youtube.com" },
              ].map(({ Icon, href }, i) => (
                <m.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 px-4 hover:bg-white/20 hover:border-cyan-400 transition-all"
                >
                  <span className="text-sm text-cyan-100">Follow us on Instagram</span>
                  <Icon className="w-5 h-5 text-cyan-400" />
                  
                </m.a>
              ))}
            </div>

            <div
              className="mx-auto md:mx-0"
              style={{
                marginTop: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, rgba(0,200,255,0.08), rgba(0,100,200,0.12))',
                border: '1px solid rgba(0,200,255,0.2)',
                borderRadius: '12px',
                padding: '10px 14px',
                maxWidth: 'fit-content',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                👤
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Founder & Owner
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: 'white',
                    letterSpacing: '0.02em',
                  }}
                >
                  Bipin Batham
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", to: "/#about" },
                { label: "Products", to: "/#products" },
                { label: "Quality Process", to: "/#process" },
                { label: "Certifications", to: "/#certifications" },
                { label: "Distribution", to: "/#distribution" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    prefetch="intent"
                    className="inline-block text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70 transition-colors duration-200 hover:translate-x-1 hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Services</h4>
            <ul className="space-y-2">
              {[
                { label: "Home Delivery", to: "/#contact" },
                { label: "Bulk Orders", to: "/#products" },
                { label: "Corporate Supply", to: "/#contact" },
                { label: "Distribution Partnership", to: "/#distribution" },
                { label: "Customer Support", to: "/#contact" },
              ].map((service, i) => (
                <li key={i}>
                  <m.div whileHover={{ x: 5 }}>
                    <Link
                      to={service.to}
                      prefetch="intent"
                      className="inline-block text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70 transition-colors hover:text-cyan-400"
                    >
                      {service.label}
                    </Link>
                  </m.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Contact Info</h4>
            <ul className="space-y-3 text-[clamp(0.75rem,1.2vw,0.95rem)]">
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Address:</span>
                <br />
                Infront New Police Line Lahar Chungi Bhind, Madhya Pradesh 477001
              </li>
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Phone:</span>
                <br />
                +91 92443 72603
              </li>
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Email:</span>
                <br />
               bipinbatham7@gmail.com
              </li>
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Hours:</span>
                <br />
                Mon-Sat: 9AM - 6PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-[clamp(1rem,3vh,1.5rem)] text-center">
          <p className="mb-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/40">
            © 2026 LIFEE Packaged Drinking Water. All rights reserved.
          </p>
          <div
            className="footer-bottom-links"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <a
              // href="/privacy"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </a>
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
              }}
            >
              |
            </span>
            <a
              // href="/terms"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              Terms of Service
            </a>
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
              }}
            >
              |
            </span>
            <a
              // href="/refund"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
