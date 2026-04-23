import { useState } from "react";
import logo from "@/assets/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "nav.home", path: "/" },
  { key: "nav.listings", path: "/listings" },
  { key: "nav.services", path: "/services" },
  { key: "nav.agents", path: "/agents" },
  { key: "nav.about", path: "/about" },
  { key: "nav.contact", path: "/contact" },
];

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-[0_8px_32px_rgba(0,55,176,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <div className="container flex min-h-16 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="EL-YANIS"
            className="h-10 w-10 rounded-2xl object-cover ring-1 ring-outline-variant/30"
          />
          <span className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">
            EL-YANIS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative rounded-2xl px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-on-surface-variant hover:text-foreground",
                )}
              >
                {t(link.key)}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#0037b0] to-[#1d4ed8]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="animate-fade-in border-t border-outline-variant/20 bg-card/95 p-4 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
