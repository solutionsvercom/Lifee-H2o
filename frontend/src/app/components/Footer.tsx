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
          <div className="footer-brand space-y-4 max-md:mb-[1.2rem] max-md:flex max-md:w-full max-md:flex-col max-md:items-center max-md:gap-2 max-md:border-b max-md:border-white/[0.08] max-md:pb-[1.2rem] max-md:text-center">
            <m.div
              animate={{
                filter: ['drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))', 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))', 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="footer-brand-title flex items-center gap-3 max-md:w-full max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-1 max-md:text-center"
            >
              <div className="text-4xl max-md:text-[28px] max-md:leading-none">💧</div>
              <div className="text-center max-md:w-full">
                <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold">
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-[clamp(1.5rem,2.2vw,1.95rem)] font-extrabold leading-tight max-md:text-[1.4rem]">
                      Lifee<sup className="ml-[0.06em] align-super text-[0.45em] font-semibold leading-none">®</sup>
                    </span>
                    <span className="font-medium uppercase leading-snug tracking-[0.15em] text-[rgba(34,211,238,0.75)] text-[0.62rem] max-md:text-[0.6rem] max-md:tracking-[0.15em]">
                      Packaged Drinking Water
                    </span>
                  </span>
                </h3>
                <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-400 max-md:text-[0.95rem] max-md:font-semibold">Purity Engineered.</p>
                <p className="mt-1 font-serif text-[0.78rem] italic tracking-wide text-cyan-300/70 max-md:text-[0.88rem]">
                  भरोसा शुद्धता का, एहसास ताज़गी का
                </p>
              </div>
            </m.div>
            <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70 max-md:mx-auto max-md:w-full max-md:max-w-[240px] max-md:text-[0.72rem] max-md:leading-relaxed max-md:opacity-70 max-md:text-center">
              Advanced purification technology delivering unmatched freshness and safety across Madhya Pradesh.
            </p>
            
            {/* Social links */}
            <div className="social-icons flex gap-3 pt-4 max-md:mx-auto max-md:w-full max-md:justify-center max-md:pt-0">
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
                  className="h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 px-4 hover:bg-white/20 hover:border-cyan-400 transition-all max-md:mx-auto max-md:h-auto max-md:px-4 max-md:py-1.5 max-md:text-[0.75rem]"
                >
                  <span className="text-sm text-cyan-100 max-md:text-[0.75rem] max-md:whitespace-nowrap">Follow us on Instagram</span>
                  <Icon className="w-5 h-5 text-cyan-400" />
                  
                </m.a>
              ))}
            </div>

            <div className="footer-owner-card mx-auto mt-[1.2rem] flex max-w-fit items-center gap-2.5 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-900/20 px-3.5 py-2.5 md:mx-0 max-md:mx-auto max-md:mt-2 max-md:w-full max-md:max-w-[220px] max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-[10px] max-md:text-left">
              <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-base">
                👤
              </div>
              <div className="max-md:text-left">
                <p className="m-0 text-[0.65rem] uppercase tracking-wider text-white/50 max-md:block max-md:text-[0.6rem] max-md:text-left max-md:normal-case max-md:tracking-normal max-md:opacity-60 max-md:whitespace-nowrap">
                  Founder & Owner
                </p>
                <p className="m-0 text-[0.95rem] font-bold tracking-wide text-white max-md:block max-md:text-[0.95rem] max-md:text-left max-md:whitespace-nowrap">
                  Bipin Batham
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
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
          <div className="footer-column">
            <h4 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Services</h4>
            <ul className="space-y-2">
              {[
                "Home Delivery",
                "Bulk Orders",
                "Corporate Supply",
                "Distribution Partnership",
                "24/7 Customer Support",
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
          <div className="footer-contact footer-column">
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
