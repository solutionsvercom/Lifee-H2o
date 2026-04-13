import { m } from "motion/react";
import { Link } from "react-router";
import { Instagram } from "lucide-react";

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
          className="footer-wave-animated h-full w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
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
              <div className="text-center">
                <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold">Lifee Packaged Drinking Water</h3>
                <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-400">Purity Engineered.</p>
                <p className="mt-1 font-serif text-[0.78rem] italic tracking-wide text-cyan-300/70">
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

            <div className="mx-auto mt-[1.2rem] flex max-w-fit items-center gap-2.5 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-900/20 px-3.5 py-2.5 md:mx-0">
              <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-base">
                👤
              </div>
              <div>
                <p className="m-0 text-[0.65rem] uppercase tracking-wider text-white/50">
                  Founder & Owner
                </p>
                <p className="m-0 text-[0.95rem] font-bold tracking-wide text-white">
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
                "Home Delivery",
                "Bulk Orders",
                "Corporate Supply",
                "Distribution Partnership",
                "Customer Support 24/7",
              ].map((label, i) => (
                <li
                  key={i}
                  className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70"
                >
                  {label}
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
          <div className="footer-bottom-links flex flex-wrap items-center justify-center gap-6">
            <span className="text-[13px] text-white/50">Privacy Policy</span>
            <span className="text-white/20">|</span>
            <span className="text-[13px] text-white/50">Terms of Service</span>
            <span className="text-white/20">|</span>
            <span className="text-[13px] text-white/50">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
