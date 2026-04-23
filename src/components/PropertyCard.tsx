import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { BedDouble, Bath, Car, MapPin, Phone } from "lucide-react";
import LazyImage from "./LazyImage";
import type { Property } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/** Ligne directe agence (affiche comme sur les visuels print / réseaux) */
const AGENCY_PHONE_TEL = "+213555123456";
const AGENCY_PHONE_DISPLAY = "+213 555 123 456";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { language, t } = useLanguage();
  const isRent = property.type === "rent";

  const title = property[`title_${language}` as keyof Property] as string;
  const cityKey = `city.${property.city}`;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(
      language === "ar" ? "ar-DZ" : language === "fr" ? "fr-DZ" : "en-US",
    ).format(price);

  const headline = `${t(`type.${property.type}`)} : ${title}, ${t(cityKey)} 📍`;

  const parkingSlots = property.amenities.some((a) => /garage|parking|Garage|Parking|مرآب/i.test(a))
    ? 1
    : 0;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-white/10",
        isRent && "ring-rent-secondary/40",
      )}
      data-variant={property.type}
    >
      {/* Image plein cadre — format paysage type annonce réseaux */}
      <div className="relative aspect-[16/10] min-h-[200px] w-full bg-neutral-900">
        <LazyImage
          src={property.images[0]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Dégradé bas pour lisibilité du texte blanc */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
          aria-hidden
        />

        {/* Lien fiche : couche cliquable sous le contenu */}
        <Link
          to={`/property/${property.id}`}
          className="absolute inset-0 z-[5]"
          aria-label={title}
        />

        {/* Contenu overlay : pointer-events-none sauf téléphone */}
        <div className="absolute inset-x-0 bottom-0 z-[10] flex flex-col justify-end p-3 text-white sm:p-3.5 md:p-4 pointer-events-none">
          {/* Titre type annonce */}
          <p className="text-[11px] font-semibold leading-snug tracking-wide sm:text-[12px] text-balance drop-shadow-md [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
            {headline}
          </p>

          {/* Prix */}
          <p className="mt-1.5 text-sm font-bold tabular-nums drop-shadow-md sm:text-[0.9375rem] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
            {formatPrice(property.price)} {t("property.dzd")}
            {isRent && (
              <span className="ms-1 text-[11px] font-semibold opacity-95">
                {t("property.cardPerMonth")}
              </span>
            )}
          </p>

          <div className="my-2 h-px w-full bg-white/35" aria-hidden />

          {/* Marque + superficie */}
          <div className="flex flex-wrap items-end justify-between gap-2">
            <span className="font-black uppercase tracking-[0.1em] text-base leading-none sm:text-lg drop-shadow-lg">
              {t("property.cardBrand")}
            </span>
            <span className="text-right text-xs font-bold tabular-nums sm:text-[13px] drop-shadow-md">
              {t("property.cardSurface")} : {property.area} {t("property.area")}
            </span>
          </div>

          {/* Caractéristiques + pastille téléphone */}
          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-2.5 sm:gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-[10px]">
                {t("property.cardKeySpecs")}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums drop-shadow sm:text-[13px]">
                  <BedDouble
                    className="h-3.5 w-3.5 shrink-0 opacity-95"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {property.bedrooms}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums drop-shadow sm:text-[13px]">
                  <Bath className="h-3.5 w-3.5 shrink-0 opacity-95" strokeWidth={2} aria-hidden />
                  {property.bathrooms}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums drop-shadow sm:text-[13px]">
                  <Car className="h-3.5 w-3.5 shrink-0 opacity-95" strokeWidth={2} aria-hidden />
                  {parkingSlots > 0 ? parkingSlots : "—"}
                </span>
              </div>
            </div>

            <a
              href={`tel:${AGENCY_PHONE_TEL}`}
              className={cn(
                "pointer-events-auto z-[20] flex max-w-[188px] items-center gap-2 rounded-full bg-neutral-950/95 px-2 py-1.5 shadow-lg ring-1 ring-white/15 transition hover:bg-neutral-900 sm:max-w-[200px] sm:px-2.5 sm:py-2",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
                <Phone
                  className="h-3.5 w-3.5 text-neutral-950 sm:h-[15px] sm:w-[15px]"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </span>
              <span className="min-w-0 text-start leading-tight">
                <span className="block text-[9px] font-medium text-white/85 sm:text-[10px]">
                  {t("property.cardMoreInfo")}
                </span>
                <span className="block text-[11px] font-bold tabular-nums tracking-tight sm:text-xs">
                  {AGENCY_PHONE_DISPLAY}
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Pastille type en coin (optionnel) */}
        <div className="absolute start-2 top-2 z-[10] pointer-events-none sm:start-2.5 sm:top-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-md backdrop-blur-sm sm:text-[10px]",
              isRent ? "bg-rent-primary/95 text-white" : "bg-white/95 text-neutral-900",
            )}
          >
            <MapPin className="h-2.5 w-2.5 opacity-80 sm:h-3 sm:w-3" aria-hidden />
            {t(`type.${property.type}`)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
