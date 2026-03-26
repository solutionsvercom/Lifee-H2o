import { useCallback, useEffect, useState } from "react";
import { Home, Info, Cog, Package, Phone, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { m, AnimatePresence } from "motion/react";
import { throttle } from "../utils/throttle";

const navItems = [
  { label: "Home", id: "home", icon: Home },
  { label: "About", id: "about", icon: Info },
  { label: "Process", id: "process", icon: Cog },
  { label: "Products", id: "products", icon: Package },
  { label: "Contact", id: "contact", icon: Phone },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => setIsScrolled(window.scrollY > 10), 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleSectionNav = useCallback(
    (id: string) => {
      if (location.pathname !== "/") {
        navigate(`/#${id}`);
      } else {
        scrollToSection(id);
      }
    },
    [location.pathname, navigate]
  );

  const onNavItemClick = useCallback(
    (id: string) => {
      closeMenu();
      handleSectionNav(id);
    },
    [closeMenu, handleSectionNav]
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 bg-white/5 backdrop-blur-[12px] border-b border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.3)] ${
        isScrolled ? "bg-[#0a2540]/75" : ""
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 section-container">
        <div className="navbar-content h-20 flex items-center justify-between gap-4">
          <Link to="/" prefetch="intent" className="flex items-center gap-2 text-white min-h-11">
            <span className="text-2xl" aria-hidden="true">
              💧
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-wide">LIFEE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionNav(item.id)}
                  className="text-cyan-100/90 hover:text-cyan-300 transition-colors text-sm font-medium inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 font-inherit"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <m.nav
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-[#071b2f]/95 backdrop-blur-xl"
          >
            <div className="mobile-nav-container container mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-col">
              <div className="mobile-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavItemClick(item.id)}
                    className="min-h-11 w-full flex items-center gap-2 px-2 py-3 text-cyan-100/90 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-all bg-transparent border-0 cursor-pointer text-left font-inherit"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              </div>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
