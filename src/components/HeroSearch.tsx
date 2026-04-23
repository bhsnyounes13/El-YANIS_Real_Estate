import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSearchProps {
  keyword: string;
  setKeyword: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  onSearch: () => void;
  t: (key: string) => string;
}

export function HeroSearch({
  keyword,
  setKeyword,
  type,
  setType,
  city,
  setCity,
  onSearch,
  t,
}: HeroSearchProps) {
  return (
    <div className="rounded-3xl bg-card/80 p-2 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20 backdrop-blur-md dark:bg-card/50">
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        <div className="relative min-h-[52px] flex-1">
          <Search
            className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder={t("hero.search")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="luminous-input h-[52px] rounded-2xl border-0 ps-11 text-base"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="luminous-input h-[52px] rounded-2xl px-4 text-sm font-medium ring-1 ring-outline-variant/25 md:w-44"
        >
          <option value="">{t("type.all")}</option>
          <option value="sale">{t("type.sale")}</option>
          <option value="rent">{t("type.rent")}</option>
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="luminous-input h-[52px] rounded-2xl px-4 text-sm font-medium ring-1 ring-outline-variant/25 md:w-48"
        >
          <option value="">{t("city.all")}</option>
          <option value="tlemcen">{t("city.tlemcen")}</option>
          <option value="ainTemouchent">{t("city.ainTemouchent")}</option>
          <option value="sidiBelAbbes">{t("city.sidiBelAbbes")}</option>
        </select>
        <Button
          type="button"
          onClick={onSearch}
          className="h-[52px] rounded-2xl px-8 font-semibold luminous-cta"
        >
          <Search className="me-2 h-4 w-4 md:inline" />
          {t("hero.searchBtn")}
        </Button>
      </div>
    </div>
  );
}
