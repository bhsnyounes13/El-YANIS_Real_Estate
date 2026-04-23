import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-surface-container/50 px-6 py-20 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-on-surface-variant">
        {t("notfound.label")}
      </p>
      <h1 className="mt-4 font-heading text-6xl font-bold tracking-[-0.04em] text-primary md:text-7xl">
        404
      </h1>
      <p className="mt-4 max-w-md text-lg text-on-surface-variant">{t("notfound.message")}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="rounded-full px-8 font-semibold luminous-cta">
          <Link to="/">{t("notfound.home")}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-outline-variant/40 px-8">
          <Link to="/listings">{t("notfound.listings")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
