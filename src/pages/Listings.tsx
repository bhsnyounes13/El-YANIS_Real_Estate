import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Building2 } from "lucide-react";

const Listings = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type && p.type !== type) return false;
      if (city && p.city !== city) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (bedrooms && p.bedrooms < Number(bedrooms)) return false;
      if (bathrooms && p.bathrooms < Number(bathrooms)) return false;
      if (keyword) {
        const q = keyword.toLowerCase();
        const searchable = `${p.title_en} ${p.title_fr} ${p.title_ar} ${p.description_en}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [keyword, type, city, minPrice, maxPrice, bedrooms, bathrooms]);

  const clearFilters = () => {
    setKeyword(""); setType(""); setCity("");
    setMinPrice(""); setMaxPrice(""); setBedrooms(""); setBathrooms("");
  };

  const selectClass = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30";

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("hero.search")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-11 rounded-xl pl-10"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">{t("type.all")}</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " mt-1.5"}>
          <option value="">{t("type.all")}</option>
          <option value="sale">{t("type.sale")}</option>
          <option value="rent">{t("type.rent")}</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">{t("city.all")}</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass + " mt-1.5"}>
          <option value="">{t("city.all")}</option>
          <option value="tlemcen">{t("city.tlemcen")}</option>
          <option value="ainTemouchent">{t("city.ainTemouchent")}</option>
          <option value="sidiBelAbbes">{t("city.sidiBelAbbes")}</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">{t("listings.price")}</label>
        <div className="mt-1.5 flex gap-2">
          <Input placeholder={t("listings.priceMin")} type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-11 rounded-xl" />
          <Input placeholder={t("listings.priceMax")} type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-11 rounded-xl" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">{t("listings.bedrooms")}</label>
        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClass + " mt-1.5"}>
          <option value="">{t("listings.any")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">{t("listings.bathrooms")}</label>
        <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={selectClass + " mt-1.5"}>
          <option value="">{t("listings.any")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      <Button variant="outline" className="w-full rounded-xl h-11" onClick={clearFilters}>
        {t("listings.clear")}
      </Button>
    </div>
  );

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Explorer" : language === "ar" ? "اكتشف" : "Explore"}
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground md:text-4xl">{t("listings.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} {language === "fr" ? "propriétés trouvées" : language === "ar" ? "عقار" : "properties found"}
          </p>
        </div>
        <Button
          variant="outline"
          className="md:hidden rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t("listings.showFilters")}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 md:block">
          <div className="sticky top-24 premium-card p-6">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold font-display mb-5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("listings.filters")}
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filter overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-background p-6 md:hidden overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">{t("listings.filters")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterPanel />
            <Button className="mt-6 w-full gradient-cta h-12 rounded-xl" onClick={() => setShowFilters(false)}>
              {t("hero.searchBtn")}
            </Button>
          </div>
        )}

        {/* Property grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">{t("listings.noResults")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === "fr" ? "Essayez d'ajuster vos filtres" : language === "ar" ? "حاول تعديل عوامل التصفية" : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
