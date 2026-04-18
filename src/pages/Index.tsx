import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users, ShieldCheck, ArrowRight, Star, TrendingUp, MapPin } from "lucide-react";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const featured = properties.slice(0, 6);

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
    { value: "500+", label: language === "fr" ? "Propriétés" : language === "ar" ? "عقار" : "Properties", icon: Building2 },
    { value: "200+", label: language === "fr" ? "Clients Satisfaits" : language === "ar" ? "عميل راضٍ" : "Happy Clients", icon: Star },
    { value: "15+", label: language === "fr" ? "Années d'Expérience" : language === "ar" ? "سنة خبرة" : "Years Experience", icon: TrendingUp },
    { value: "3", label: language === "fr" ? "Villes" : language === "ar" ? "مدن" : "Cities", icon: MapPin },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        {/* Ambient glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-gold/15 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />

        <div className="container relative z-10 py-28 md:py-40">
          {/* Eyebrow */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              <Star className="h-3 w-3 fill-current" />
              {language === "fr" ? "Immobilier Premium" : language === "ar" ? "عقارات فاخرة" : "Premium Real Estate"}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-center font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t("hero.title")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-primary-foreground/70 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t("hero.subtitle")}
          </p>

          {/* Gold accent line */}
          <div className="flex justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="gold-line" />
          </div>

          {/* Premium Search Bar */}
          <div className="mx-auto mt-10 max-w-3xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-effect-strong rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("hero.search")}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="h-12 border-none bg-transparent pl-11 text-base shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 px-4 text-sm text-foreground outline-none transition-colors hover:bg-muted"
                  >
                    <option value="">{t("type.all")}</option>
                    <option value="sale">{t("type.sale")}</option>
                    <option value="rent">{t("type.rent")}</option>
                  </select>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 px-4 text-sm text-foreground outline-none transition-colors hover:bg-muted"
                  >
                    <option value="">{t("city.all")}</option>
                    <option value="tlemcen">{t("city.tlemcen")}</option>
                    <option value="ainTemouchent">{t("city.ainTemouchent")}</option>
                    <option value="sidiBelAbbes">{t("city.sidiBelAbbes")}</option>
                  </select>
                  <Button onClick={handleSearch} className="h-12 rounded-xl gradient-cta px-6 text-base">
                    <Search className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{t("hero.searchBtn")}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-primary-foreground font-display md:text-4xl animate-count-up" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-primary-foreground/50 font-display">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Pourquoi Nous Choisir" : language === "ar" ? "لماذا تختارنا" : "Why Choose Us"}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {language === "fr" ? "L'Excellence Immobilière" : language === "ar" ? "التميز العقاري" : "Real Estate Excellence"}
          </h2>
          <div className="mx-auto mt-4 gold-line" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="premium-card p-8 text-center group"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                <f.icon className="h-8 w-8 text-primary transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-card-foreground">{t(f.titleKey)}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative overflow-hidden pb-24 md:pb-32">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

        <div className="container relative z-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
                {language === "fr" ? "Collection Exclusive" : language === "ar" ? "مجموعة حصرية" : "Exclusive Collection"}
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">{t("home.featured")}</h2>
            </div>
            <Button asChild variant="outline" className="group rounded-full border-primary/20 hover:border-primary/40">
              <Link to="/listings" className="flex items-center gap-2">
                {t("home.viewAll")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-4 gold-line md:mx-0" />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-navy-light to-foreground dark:from-card dark:via-navy-light/30 dark:to-card" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container relative z-10 py-20 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            {language === "fr" ? "Prêt à Trouver Votre Maison de Rêve ?" : language === "ar" ? "هل أنت مستعد للعثور على منزل أحلامك؟" : "Ready to Find Your Dream Home?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr" ? "Contactez nos experts dès aujourd'hui" : language === "ar" ? "تواصل مع خبرائنا اليوم" : "Get in touch with our experts today"}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gradient-cta-gold rounded-full px-8 text-base">
              <Link to="/contact">{t("nav.contact")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base">
              <Link to="/listings">{t("nav.listings")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
