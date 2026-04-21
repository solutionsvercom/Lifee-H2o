import { m } from "motion/react";
import { Link } from "react-router";
import {
  Building2,
  Clock3,
  Droplets,
  Handshake,
  House,
  Info,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Settings,
  Trophy,
  Truck,
} from "lucide-react";

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

            <div className="footer-owner-card mx-auto mt-[1.2rem] flex max-w-fit items-center gap-2.5 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-900/20 px-3.5 py-2.5 md:mx-0 max-md:mx-auto max-md:mt-2 max-md:w-full max-md:max-w-[220px] max-md:flex-row max-md:items-center max-md:justify-center max-md:gap-[10px]">
              <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-base">
                👤
              </div>
              <div className="max-md:text-center">
                <p className="m-0 text-[0.65rem] uppercase tracking-wider text-white/50 max-md:block max-md:text-[0.6rem] max-md:text-center max-md:normal-case max-md:tracking-normal max-md:opacity-60 max-md:whitespace-nowrap">
                  Founder & Owner
                </p>
                <p className="m-0 text-[0.95rem] font-bold tracking-wide text-white max-md:block max-md:text-[0.95rem] max-md:text-center max-md:whitespace-nowrap">
                  B.KUMAR
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column footer-quick-links m-0 max-md:p-0">
            <h4 className="mb-4 w-full pl-0 text-left text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white max-md:mb-3">
              Quick Links
            </h4>
            <ul className="m-0 list-none space-y-3 p-0 pl-0">
              {[
                { label: "About Us", to: "/#about", Icon: Info },
                { label: "Products", to: "/#products", Icon: Droplets },
                { label: "Quality Process", to: "/#process", Icon: Settings },
                { label: "Certifications", to: "/#certifications", Icon: Trophy },
                { label: "Distribution", to: "/#distribution", Icon: Truck },
              ].map((link, i) => (
                <li key={i} className="list-none pl-0 text-left">
                  <Link
                    to={link.to}
                    prefetch="intent"
                    className="flex w-full max-w-full items-start gap-2 pl-0 text-left leading-snug text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70 transition-colors duration-200 hover:translate-x-1 hover:text-cyan-400 md:items-center"
                  >
                    <link.Icon
                      className="mt-[0.2em] size-[0.875rem] shrink-0 text-cyan-100/70 opacity-[0.85] md:mt-0 md:size-3 md:translate-y-[0.08em]"
                      aria-hidden
                    />
                    <span className="min-w-0">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h4 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Home Delivery", Icon: House },
                { label: "Bulk Orders", Icon: Package },
                { label: "Corporate Supply", Icon: Building2 },
                { label: "Distribution Partnership", Icon: Handshake },
                { label: "24/7 Customer Support", Icon: MessageCircle },
              ].map(({ label, Icon }, i) => (
                <li
                  key={i}
                  className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/70"
                >
                  <span className="flex items-start gap-1.5 leading-snug md:items-center">
                    <Icon
                      className="mt-[0.2em] size-3 shrink-0 opacity-[0.85] text-cyan-100/70 md:mt-0 md:translate-y-[0.08em]"
                      aria-hidden
                    />
                    <span className="min-w-0">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact footer-column">
            <h4 className="mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Contact Info</h4>
            <ul className="space-y-3 text-[clamp(0.75rem,1.2vw,0.95rem)]">
              <li className="text-cyan-100/70">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-0.5 leading-snug">
                  <MapPin
                    className="row-start-1 size-3 shrink-0 self-center text-cyan-100/70 opacity-[0.85]"
                    aria-hidden
                  />
                  <span className="row-start-1 self-center font-semibold text-white">Address:</span>
                  <span className="col-start-2 row-start-2 block leading-snug">
                    Infront New Police Line Lahar Chungi Bhind, Madhya Pradesh, 477001
                  </span>
                </div>
              </li>
              <li className="text-cyan-100/70">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-0.5 leading-snug">
                  <Phone
                    className="row-start-1 size-3 shrink-0 self-center text-cyan-100/70 opacity-[0.85]"
                    aria-hidden
                  />
                  <span className="row-start-1 self-center font-semibold text-white">Phone:</span>
                  <span className="col-start-2 row-start-2 block leading-snug">+91 92443 72603</span>
                </div>
              </li>
              <li className="text-cyan-100/70">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-0.5 leading-snug">
                  <Mail
                    className="row-start-1 size-3 shrink-0 self-center text-cyan-100/70 opacity-[0.85]"
                    aria-hidden
                  />
                  <span className="row-start-1 self-center font-semibold text-white">Email:</span>
                  <span className="col-start-2 row-start-2 block break-all leading-snug">lifeeh2o@gmail.com</span>
                </div>
              </li>
              <li className="text-cyan-100/70">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-0.5 leading-snug">
                  <Clock3
                    className="row-start-1 size-3 shrink-0 self-center text-cyan-100/70 opacity-[0.85]"
                    aria-hidden
                  />
                  <span className="row-start-1 self-center font-semibold text-white">Hours:</span>
                  <span className="col-start-2 row-start-2 block leading-snug">Mon-Sat: 9AM - 6PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-[clamp(1rem,3vh,1.5rem)] text-center">
          <div className="mb-[clamp(0.5rem,1.5vh,0.75rem)] w-full max-md:overflow-x-auto max-md:[scrollbar-width:none] max-md:[-ms-overflow-style:none] max-md:[&::-webkit-scrollbar]:hidden">
            <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white/40 max-md:inline-block max-md:whitespace-nowrap max-md:text-[clamp(0.56rem,2.65vw,0.82rem)] max-md:leading-snug md:block md:whitespace-normal">
              © 2026 LIFEE Packaged Drinking Water. All rights reserved.
            </p>
          </div>
          <div className="footer-bottom-links flex flex-nowrap items-center justify-center gap-x-1.5 md:gap-x-6">
            <span className="whitespace-nowrap text-[clamp(0.62rem,2.5vw,0.8125rem)] text-white/50 md:text-[13px]">
              Privacy Policy
            </span>
            <span className="shrink-0 text-white/20 max-md:text-[clamp(0.62rem,2.5vw,0.8125rem)] md:text-[13px]">
              |
            </span>
            <span className="whitespace-nowrap text-[clamp(0.62rem,2.5vw,0.8125rem)] text-white/50 md:text-[13px]">
              Terms of Service
            </span>
            <span className="shrink-0 text-white/20 max-md:text-[clamp(0.62rem,2.5vw,0.8125rem)] md:text-[13px]">
              |
            </span>
            <span className="whitespace-nowrap text-[clamp(0.62rem,2.5vw,0.8125rem)] text-white/50 md:text-[13px]">
              Refund Policy
            </span>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "0.8rem",
              paddingTop: "0.8rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.02em",
              }}
            >
              Designed by :{" "}
              <a
                href="https://www.vercomsolutions.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#22d3ee",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Vercom Solutions Pvt. Ltd.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
