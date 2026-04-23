import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/HeroSearch";
import { SectionShell } from "@/components/SectionShell";
import { SectionHeading } from "@/components/SectionHeading";
import { ApiErrorState } from "@/components/ApiErrorState";
import { getQueryErrorDescription } from "@/lib/api/mapApiUserMessage";
import { useFeaturedProperties } from "@/hooks/queries/useFeaturedProperties";
import { Building2, Users, ShieldCheck, ArrowRight, MapPin } from "lucide-react";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data: featured = [], isLoading, isError, error, refetch } = useFeaturedProperties();

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const spotlight = featured[0];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    navigate(`/listings?${params.toString()}`);
  };

  const features = [
    { icon: Building2, titleKey: "features.premium.title", descKey: "features.premium.desc" },
    { icon: Users, titleKey: "features.agents.title", descKey: "features.agents.desc" },
    { icon: ShieldCheck, titleKey: "features.trusted.title", descKey: "features.trusted.desc" },
  ];

  const stats = [
    {
      value: "500+",
      label: language === "fr" ? "Propriétés" : language === "ar" ? "عقار" : "Properties",
    },
    {
      value: "200+",
      label: language === "fr" ? "Clients" : language === "ar" ? "عميل" : "Clients",
    },
    { value: "15+", label: language === "fr" ? "Années" : language === "ar" ? "سنوات" : "Years" },
    { value: "3", label: language === "fr" ? "Villes" : language === "ar" ? "مدن" : "Cities" },
  ];

  const cities = [
    { key: "city.tlemcen", slug: "tlemcen" as const },
    { key: "city.ainTemouchent", slug: "ainTemouchent" as const },
    { key: "city.sidiBelAbbes", slug: "sidiBelAbbes" as const },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0037b0] via-[#0a3cb8] to-[#1d4ed8] text-primary-foreground">
        <div className="pointer-events-none absolute -start-32 top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="pointer-events-none absolute -end-24 bottom-0 h-80 w-80 rounded-full bg-[#5e52b4]/25 blur-[100px]" />

        <div className="container relative z-[1] py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                {t("home.heroEyebrow")}
              </p>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.03em] md:text-5xl lg:text-[3.35rem] text-balance-editorial">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {t("hero.subtitle")}
              </p>

              <div className="mt-10">
                <HeroSearch
                  keyword={keyword}
                  setKeyword={setKeyword}
                  type={type}
                  setType={setType}
                  city={city}
                  setCity={setCity}
                  onSearch={handleSearch}
                  t={t}
                />
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 rounded-3xl border border-white/15 bg-white/5 px-6 py-8 backdrop-blur-md md:grid-cols-4 md:gap-10 md:px-10">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-heading text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/65">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              {isError ? (
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-sm text-white/90 backdrop-blur-sm">
                  <p className="font-medium">{getQueryErrorDescription(error, t)}</p>
                  <button
                    type="button"
                    className="mt-4 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/25"
                    onClick={() => void refetch()}
                  >
                    {t("common.retry")}
                  </button>
                </div>
              ) : isLoading ? (
                <div className="aspect-[4/5] w-full max-w-md animate-pulse rounded-3xl bg-white/10 ms-auto lg:max-w-none" />
              ) : spotlight ? (
                <div className="relative ms-auto max-w-md lg:max-w-none">
                  <div
                    className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-white/20 to-transparent blur-2xl"
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] ring-1 ring-white/20">
                    <PropertyCard property={spotlight} />
                  </div>
                  <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/60 lg:text-start">
                    {t("home.spotlight")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <SectionShell tone="muted">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.whyEyebrow")}
            title={t("home.whyTitle")}
            subtitle={t("home.whySubtitle")}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="luminous-card-quiet p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold tracking-[-0.02em]">
                  {t(f.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {t(f.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="container">
          <SectionHeading
            eyebrow={t("home.featuredEyebrow")}
            title={t("home.featured")}
            subtitle={t("home.featuredSubtitle")}
            action={
              <Button
                asChild
                variant="outline"
                className="hidden rounded-full border-outline-variant/40 md:inline-flex"
              >
                <Link to="/listings" className="gap-2">
                  {t("home.viewAll")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isError ? (
              <div className="col-span-full">
                <ApiErrorState
                  title={t("toast.error")}
                  description={getQueryErrorDescription(error, t)}
                  onRetry={() => void refetch()}
                  retryLabel={t("common.retry")}
                />
              </div>
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-muted" />
              ))
            ) : featured.length === 0 ? (
              <p className="col-span-full text-center text-sm text-muted-foreground">
                {language === "fr"
                  ? "Aucune propriété mise en avant pour le moment."
                  : language === "ar"
                    ? "لا توجد عقارات مميزة حالياً."
                    : "No featured listings yet."}
              </p>
            ) : (
              featured.slice(0, 6).map((p) => <PropertyCard key={p.id} property={p} />)
            )}
          </div>
          <div className="mt-10 flex justify-center md:hidden">
            <Button asChild variant="outline" className="rounded-full border-outline-variant/40">
              <Link to="/listings">{t("home.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="muted">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.citiesEyebrow")}
            title={t("home.citiesTitle")}
            subtitle={t("home.citiesSubtitle")}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                to={`/listings?city=${c.slug}`}
                className="group flex items-center justify-between rounded-3xl bg-card px-6 py-6 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20 transition hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-3 font-heading text-lg font-semibold tracking-[-0.02em]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-container text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  {t(c.key)}
                </span>
                <ArrowRight className="h-5 w-5 text-on-surface-variant transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="container">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a1633] via-[#0d2a6e] to-[#1d4ed8] px-8 py-14 text-center text-primary-foreground shadow-[var(--shadow-ambient)] md:px-16 md:py-20">
            <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] md:text-4xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">{t("home.ctaSubtitle")}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-10 font-semibold luminous-cta">
                <Link to="/contact">{t("nav.contact")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/15"
              >
                <Link to="/listings">{t("nav.listings")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

export default Index;
