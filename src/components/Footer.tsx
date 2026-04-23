import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-surface-container/80 dark:bg-surface-container/40">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="EL-YANIS"
                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-outline-variant/25"
              />
              <span className="font-heading text-lg font-bold tracking-[-0.02em] text-foreground">
                {t("footer.brand")}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-surface-variant">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              {t("footer.links")}
            </h4>
            <nav className="mt-5 flex flex-col gap-2.5">
              {[
                { key: "nav.home", path: "/" },
                { key: "nav.listings", path: "/listings" },
                { key: "nav.about", path: "/about" },
                { key: "nav.contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-foreground"
                >
                  {t(link.key)}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              {t("footer.contactTitle")}
            </h4>
            <div className="mt-5 flex flex-col gap-3 text-sm text-on-surface-variant">
              <a
                href="tel:+213555123456"
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-container-lowest text-primary shadow-[var(--shadow-ambient)]">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                +213 555 123 456
              </a>
              <a
                href="mailto:contact@elyainis.com"
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-container-lowest text-primary shadow-[var(--shadow-ambient)]">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                contact@elyainis.com
              </a>
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-container-lowest text-primary shadow-[var(--shadow-ambient)]">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                Tlemcen, {language === "ar" ? "الجزائر" : language === "fr" ? "Algérie" : "Algeria"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-outline-variant/25 pt-8 md:flex-row md:justify-between">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} EL-YANIS. {t("footer.rights")}
          </p>
          <p className="text-xs text-on-surface-variant/70">
            {language === "fr"
              ? "Immobilier lumineux, pensé pour l’ouest algérien."
              : language === "ar"
                ? "عقارات بروح معمارية في غرب الجزائر."
                : "Luminous real estate, crafted for western Algeria."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
