import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t bg-card">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="EL-YANIS" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-heading text-xl font-bold text-card-foreground">{t("footer.brand")}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">{t("footer.desc")}</p>
            <div className="mt-5 gold-line" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">{t("footer.links")}</h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[
                { key: "nav.home", path: "/" },
                { key: "nav.listings", path: "/listings" },
                { key: "nav.about", path: "/about" },
                { key: "nav.contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(link.key)}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">{t("footer.contactTitle")}</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="tel:+213555123456" className="flex items-center gap-2.5 transition-colors hover:text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +213 555 123 456
              </a>
              <a href="mailto:contact@elyainis.com" className="flex items-center gap-2.5 transition-colors hover:text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                contact@elyainis.com
              </a>
              <span className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                Tlemcen, {language === "ar" ? "الجزائر" : language === "fr" ? "Algérie" : "Algeria"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-border/50 pt-8 md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EL-YANIS. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground/50">
            {language === "fr" ? "Conçu avec excellence" : language === "ar" ? "صُمم بتميز" : "Crafted with excellence"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
