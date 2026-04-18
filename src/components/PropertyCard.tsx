import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import LazyImage from "./LazyImage";
import type { Property } from "@/data/mockData";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { language, t } = useLanguage();

  const title = property[`title_${language}` as keyof Property] as string;
  const cityKey = `city.${property.city}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-DZ" : language === "fr" ? "fr-DZ" : "en-US").format(price);
  };

  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="premium-card">
        <div className="relative aspect-[16/10] overflow-hidden">
          <LazyImage
            src={property.images[0]}
            alt={title}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <span className={`absolute top-3 ${language === "ar" ? "right-3" : "left-3"} ${
            property.type === "sale" ? "premium-badge" : "rent-badge"
          }`}>
            {t(`type.${property.type}`)}
          </span>

          {/* Price overlay on hover */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-lg font-bold text-primary-foreground font-display drop-shadow-lg">
              {formatPrice(property.price)} {t("property.dzd")}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-heading text-lg font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span>{t(cityKey)}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" /> {property.area} {t("property.area")}
              </span>
            </div>
            <div className="font-display text-sm font-bold text-gradient">
              {formatPrice(property.price)}
              {property.type === "rent" && <span className="text-xs font-normal text-muted-foreground">/{language === "fr" ? "mois" : language === "ar" ? "شهر" : "mo"}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
