import { useCallback, useEffect, useState } from "react";
import { Home, Info, Cog, Package, Phone, Menu, X, Award } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { m, AnimatePresence } from "motion/react";
import { throttle } from "../utils/throttle";
import { suppressSectionScrollSpy } from "../hooks/useSectionNavigation";

const navItems = [
  { label: "Home", id: "home", icon: Home },
  { label: "About", id: "about", icon: Info },
  { label: "Process", id: "process", icon: Cog },
  { label: "Products", id: "products", icon: Package },
  { label: "Certifications", id: "certifications", icon: Award },
  { label: "Contact", id: "contact", icon: Phone },
] as const;

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
      suppressSectionScrollSpy();
      const nextHash = `#${id}`;
      if (location.pathname === "/" && location.hash === nextHash) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      navigate({ pathname: "/", hash: nextHash }, { replace: false, preventScrollReset: false });
    },
    [location.pathname, location.hash, navigate]
  );

  const onNavItemClick = useCallback(
    (id: string) => {
      closeMenu();
      handleSectionNav(id);
    },
    [closeMenu, handleSectionNav]
  );

  const activeId =
    location.pathname === "/" ? (location.hash.replace(/^#/, "") || "home") : "";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 bg-white/5 backdrop-blur-[12px] border-b border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.3)] ${
        isScrolled ? "bg-[#0a2540]/75" : ""
      }`}
    >
      <div className="container mx-auto w-full max-w-[min(100%,1400px)] px-[clamp(1rem,4vw,3rem)]">
        <div className="navbar-content flex h-[clamp(50px,8vh,70px)] min-h-[clamp(50px,8vh,70px)] flex-wrap items-center justify-between gap-[clamp(1rem,3vw,3rem)]">
          <Link
            to="/"
            prefetch="intent"
            className="flex min-h-11 flex-wrap items-center gap-2 text-white max-md:h-[clamp(50px,8vh,70px)] max-md:min-h-0 max-md:items-center"
          >
            <div className="flex items-start gap-2 max-md:items-center max-md:gap-2">
              <span className="text-2xl max-md:flex max-md:items-center max-md:text-3xl" aria-hidden="true">
                💧
              </span>

              <div className="flex flex-col leading-none max-md:items-start">
                <span className="inline-block text-[clamp(1.8rem,7vw,2rem)] font-extrabold tracking-wide text-white leading-none max-md:text-[clamp(2.05rem,8.5vw,2.45rem)]">
                  Lifee
                  <span className="ml-[0.06em] inline-block align-super text-[0.44em] translate-y-[0.06em] font-semibold leading-none text-cyan-300/90 max-md:ml-[0.05em] max-md:text-[0.48em] max-md:translate-y-[0.12em]">
                    ®
                  </span>
                </span>

                <span className="mt-0.5 text-[clamp(0.66rem,1.9vw,0.86rem)] font-medium uppercase leading-none tracking-wide text-cyan-300/75 max-md:mt-px max-md:text-[0.5rem] max-md:tracking-[0.1em]">
                  Packaged Drinking Water
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden flex-wrap items-center gap-[clamp(1rem,3vw,3rem)] md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionNav(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-2 border-0 bg-transparent p-0 font-inherit text-[clamp(0.8rem,1.2vw,1rem)] font-medium transition-colors ${
                    isActive
                      ? "text-cyan-300 underline decoration-cyan-400/80 underline-offset-8"
                      : "text-cyan-100/90 hover:text-cyan-300"
                  }`}
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
            <div className="mobile-nav-container container mx-auto flex w-full max-w-[min(100%,1400px)] flex-col px-[clamp(1rem,4vw,3rem)] py-3">
              <div className="mobile-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavItemClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-h-11 w-full flex items-center gap-2 px-2 py-3 rounded-md border-0 bg-transparent text-left font-inherit text-[clamp(0.8rem,1.2vw,1rem)] transition-all ${
                      isActive
                        ? "text-cyan-300 bg-white/10"
                        : "text-cyan-100/90 hover:text-cyan-300 hover:bg-white/5"
                    }`}
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
