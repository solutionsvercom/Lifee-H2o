import { motion } from "motion/react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0A2540] to-slate-950 text-white pt-14 md:pt-16 pb-8 px-4 sm:px-6">
      {/* Wave divider */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <motion.div
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

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <motion.div
              animate={{
                filter: ['drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))', 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))', 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="flex items-center gap-3"
            >
              <div className="text-4xl">💧</div>
              <div>
                <h3 className="text-2xl font-bold">LIFEE Water</h3>
                <p className="text-cyan-400 text-sm">Purity Engineered</p>
              </div>
            </motion.div>
            <p className="text-cyan-100/70 text-sm">
              Advanced purification technology delivering unmatched freshness and safety across Madhya Pradesh.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3 pt-4">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Twitter, href: "https://x.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
                { Icon: Youtube, href: "https://youtube.com" },
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-cyan-400 transition-all"
                >
                  <Icon className="w-5 h-5 text-cyan-400" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "#about" },
                { label: "Products", href: "#products" },
                { label: "Quality Process", href: "#process" },
                { label: "Certifications", href: "#certifications" },
                { label: "Distribution", href: "#distribution" },
              ].map((link, i) => (
                <li key={i}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-cyan-100/70 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {[
                { label: "Home Delivery", href: "#contact" },
                { label: "Bulk Orders", href: "#products" },
                { label: "Corporate Supply", href: "#contact" },
                { label: "Distribution Partnership", href: "#distribution" },
                { label: "Customer Support", href: "#contact" },
              ].map((service, i) => (
                <li key={i}>
                  <motion.a
                    href={service.href}
                    whileHover={{ x: 5 }}
                    className="text-cyan-100/70 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {service.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Address:</span>
                <br />
                Bhopal, Madhya Pradesh, India
              </li>
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Phone:</span>
                <br />
                +91 98765 43210
              </li>
              <li className="text-cyan-100/70">
                <span className="text-white font-semibold">Email:</span>
                <br />
                contact@premiumwater.com
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
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cyan-100/60 text-sm text-center md:text-left">
              © 2026 Premium Water. All rights reserved. Designed with precision.
            </p>
            <div className="flex gap-6">
              {[
                { label: "Privacy Policy", href: "#contact" },
                { label: "Terms of Service", href: "#contact" },
                { label: "Refund Policy", href: "#contact" },
              ].map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  whileHover={{ scale: 1.05 }}
                  className="text-cyan-100/60 hover:text-cyan-400 text-sm transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
