import { useCallback, useEffect, useRef, useState } from "react";
import { Home, Info, Cog, Package, Phone, Award } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
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
  const [menuHeight, setMenuHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = throttle(() => setIsScrolled(window.scrollY > 10), 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      ref={navRef}
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
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "1px solid rgba(0,200,255,0.2)",
              background: "rgba(0,200,255,0.05)",
              color: "#22d3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              flexShrink: 0,
            }}
            className="md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            <div
              style={{
                width: "18px",
                height: "14px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "2px",
                  background: "#22d3ee",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  transformOrigin: "center",
                  transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  background: "#22d3ee",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen ? "scaleX(0)" : "scaleX(1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  background: "#22d3ee",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  transformOrigin: "center",
                  transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className="md:hidden"
        style={{
          overflow: "hidden",
          maxHeight: isOpen ? `${menuHeight}px` : "0px",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "rgba(10, 25, 47, 0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: isOpen ? "1px solid rgba(0,200,255,0.15)" : "none",
          width: "100%",
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <div
          ref={menuRef}
          style={{
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.2rem",
          }}
        >
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavItemClick(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  transition: "background 0.2s",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(-8px)",
                  transitionDelay: isOpen ? `${i * 0.05}s` : "0s",
                  border: 0,
                  background: "transparent",
                  width: "100%",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,200,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
