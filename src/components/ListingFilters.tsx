import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
type TFunc = (key: string) => string;

interface ListingFiltersProps {
  t: TFunc;
  keyword: string;
  setKeyword: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
  bathrooms: string;
  setBathrooms: (v: string) => void;
  onClear: () => void;
  rentMode?: boolean;
}

export function ListingFilters({
  t,
  keyword,
  setKeyword,
  type,
  setType,
  city,
  setCity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  onClear,
  rentMode,
}: ListingFiltersProps) {
  const selectClass =
    "luminous-input h-11 w-full rounded-2xl px-4 text-sm ring-1 ring-outline-variant/25 focus-visible:ring-2 focus-visible:ring-primary/25";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 border-b border-outline-variant/25 pb-4">
        <SlidersHorizontal
          className={`h-4 w-4 ${rentMode ? "text-rent-primary" : "text-primary"}`}
          aria-hidden
        />
        <h3
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${rentMode ? "text-rent-primary" : "text-on-surface-variant"}`}
        >
          {t("listings.filters")}
        </h3>
      </div>

      <div className="relative">
        <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden />
        <Input
          placeholder={t("hero.search")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="luminous-input h-11 rounded-2xl ps-10 ring-1 ring-outline-variant/25"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
          {t("type.all")}
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`${selectClass} mt-2`}
        >
          <option value="">{t("type.all")}</option>
          <option value="sale">{t("type.sale")}</option>
          <option value="rent">{t("type.rent")}</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
          {t("city.all")}
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`${selectClass} mt-2`}
        >
          <option value="">{t("city.all")}</option>
          <option value="tlemcen">{t("city.tlemcen")}</option>
          <option value="ainTemouchent">{t("city.ainTemouchent")}</option>
          <option value="sidiBelAbbes">{t("city.sidiBelAbbes")}</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
          {t("listings.price")}
        </label>
        <div className="mt-2 flex gap-2">
          <Input
            placeholder={t("listings.priceMin")}
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="luminous-input h-11 rounded-2xl ring-1 ring-outline-variant/25"
          />
          <Input
            placeholder={t("listings.priceMax")}
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="luminous-input h-11 rounded-2xl ring-1 ring-outline-variant/25"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
          {t("listings.bedrooms")}
        </label>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className={`${selectClass} mt-2`}
        >
          <option value="">{t("listings.any")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
          {t("listings.bathrooms")}
        </label>
        <select
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className={`${selectClass} mt-2`}
        >
          <option value="">{t("listings.any")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-2xl border-outline-variant/40"
        onClick={onClear}
      >
        {t("listings.clear")}
      </Button>
    </div>
  );
}
