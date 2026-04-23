import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ListingFilters } from "@/components/ListingFilters";
import { EmptyState } from "@/components/EmptyState";
import { ApiErrorState } from "@/components/ApiErrorState";
import { getQueryErrorDescription } from "@/lib/api/mapApiUserMessage";
import { PageHero } from "@/components/PageHero";
import { useProperties } from "@/hooks/queries/useProperties";
import { Building2, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Property } from "@/lib/domain/types";

function filterProperties(
  list: Property[],
  keyword: string,
  type: string,
  city: string,
  minPrice: string,
  maxPrice: string,
  bedrooms: string,
  bathrooms: string,
): Property[] {
  return list.filter((p) => {
    if (type && p.type !== type) return false;
    if (city && p.city !== city) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (bedrooms && p.bedrooms < Number(bedrooms)) return false;
    if (bathrooms && p.bathrooms < Number(bathrooms)) return false;
    if (keyword) {
      const q = keyword.toLowerCase();
      const searchable =
        `${p.title_en} ${p.title_fr} ${p.title_ar} ${p.description_en}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

const Listings = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const { data: properties = [], isLoading, isError, error, refetch } = useProperties();

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const rentMode = type === "rent";

  const filtered = useMemo(
    () =>
      filterProperties(properties, keyword, type, city, minPrice, maxPrice, bedrooms, bathrooms),
    [properties, keyword, type, city, minPrice, maxPrice, bedrooms, bathrooms],
  );

  const clearFilters = () => {
    setKeyword("");
    setType("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
  };

  const filterPanel = (
    <ListingFilters
      t={t}
      keyword={keyword}
      setKeyword={setKeyword}
      type={type}
      setType={setType}
      city={city}
      setCity={setCity}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      bedrooms={bedrooms}
      setBedrooms={setBedrooms}
      bathrooms={bathrooms}
      setBathrooms={setBathrooms}
      onClear={clearFilters}
      rentMode={rentMode}
    />
  );

  return (
    <div data-rent-context={rentMode ? "true" : undefined}>
      <PageHero
        variant="soft"
        eyebrow={t("listings.heroEyebrow")}
        title={t("listings.title")}
        description={t("listings.heroDesc")}
        align="left"
      />

      <div className="container py-12 md:py-16">
        {isError ? (
          <div className="mb-8">
            <ApiErrorState
              title={t("toast.error")}
              description={getQueryErrorDescription(error, t)}
              onRetry={() => void refetch()}
              retryLabel={t("common.retry")}
            />
          </div>
        ) : null}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">
              {isLoading || isError ? "…" : filtered.length}{" "}
              {language === "fr" ? "résultats" : language === "ar" ? "نتيجة" : "results"}
            </p>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className={`rounded-full border-outline-variant/40 ${rentMode ? "text-rent-primary border-rent-secondary/50" : ""}`}
                >
                  <SlidersHorizontal className="me-2 h-4 w-4" />
                  {t("listings.filters")}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[85vh] overflow-y-auto rounded-t-3xl border-outline-variant/30"
              >
                <SheetHeader>
                  <SheetTitle>{t("listings.filters")}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{filterPanel}</div>
                <SheetClose asChild>
                  <Button
                    type="button"
                    className={`mt-6 w-full rounded-2xl font-semibold ${rentMode ? "luminous-cta-rent" : "luminous-cta"}`}
                  >
                    {t("listings.apply")}
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div
              className={`sticky top-24 rounded-3xl p-6 shadow-[var(--shadow-ambient)] ${
                rentMode
                  ? "bg-rent-soft ring-1 ring-rent-secondary/30"
                  : "bg-card ring-1 ring-outline-variant/20"
              }`}
            >
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {isError ? null : isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-muted" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Building2}
                title={t("listings.noResults")}
                description={t("listings.noResultsHint")}
              >
                <Button variant="outline" className="mt-6 rounded-full" onClick={clearFilters}>
                  {t("listings.clear")}
                </Button>
              </EmptyState>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
