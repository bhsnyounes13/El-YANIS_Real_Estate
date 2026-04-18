import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { properties, agents } from "@/data/mockData";
import LazyImage from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, ArrowRight, ChevronLeft, MapPin,
  BedDouble, Bath, Maximize, Check, Phone, Mail, Send, CalendarDays,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const property = properties.find((p) => p.id === id);

  // Compute booked date ranges for the calendar (must be before early return)
  const bookedRanges = useMemo(() => {
    if (!property?.bookedDates) return [];
    return property.bookedDates.map((r) => ({
      from: new Date(r.from),
      to: new Date(r.to),
    }));
  }, [property?.bookedDates]);

  const isDateBooked = (date: Date) => {
    return bookedRanges.some((range) => {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const from = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate());
      const to = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate());
      return d >= from && d <= to;
    });
  };

  const isSelectedBooked = selectedDate ? isDateBooked(selectedDate) : false;

  if (!property) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xl text-muted-foreground">{t("detail.notFound")}</p>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/listings">{t("detail.back")}</Link>
        </Button>
      </div>
    );
  }

  const agent = agents.find((a) => a.id === property.agent_id);
  const title = property[`title_${language}` as keyof typeof property] as string;
  const description = property[`description_${language}` as keyof typeof property] as string;
  const agentBio = agent ? (agent[`bio_${language}` as keyof typeof agent] as string) : "";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(language === "ar" ? "ar-DZ" : language === "fr" ? "fr-DZ" : "en-US").format(price);

  const prevImage = () => setCurrentImage((i) => (i === 0 ? property.images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage((i) => (i === property.images.length - 1 ? 0 : i + 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "The agent will contact you shortly." });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container py-10">
      <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {t("detail.back")}
      </Link>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Carousel */}
          <div className="relative overflow-hidden rounded-2xl">
            <LazyImage
              src={property.images[currentImage]}
              alt={title}
              className="aspect-[16/10] w-full"
            />
            {property.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full glass-effect-strong hover:scale-105 transition-transform">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full glass-effect-strong hover:scale-105 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentImage ? "w-6 bg-primary-foreground" : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={property.type === "sale" ? "premium-badge" : "rent-badge"}>
                {t(`type.${property.type}`)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold" /> {t(`city.${property.city}`)}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">{title}</h1>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-gradient">
                {formatPrice(property.price)} {t("property.dzd")}
              </span>
              {property.type === "rent" && (
                <span className="text-base text-muted-foreground">/{language === "fr" ? "mois" : language === "ar" ? "شهر" : "mo"}</span>
              )}
            </div>

            {/* Stats cards */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: BedDouble, value: property.bedrooms, label: t("property.beds") },
                { icon: Bath, value: property.bathrooms, label: t("property.baths") },
                { icon: Maximize, value: `${property.area}`, label: t("property.area") },
              ].map((stat, i) => (
                <div key={i} className="premium-card p-4 text-center">
                  <stat.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-2 text-lg font-bold text-card-foreground font-display">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-foreground">{t("detail.description")}</h2>
              <div className="mt-2 gold-line" />
              <p className="mt-4 text-muted-foreground leading-relaxed text-[15px]">{description}</p>
            </div>

            <div className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-foreground">{t("detail.amenities")}</h2>
              <div className="mt-2 gold-line" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-3 text-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">

            {/* Availability Calendar — only for rent */}
            {property.type === "rent" && (
              <div className="premium-card p-6">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold font-display">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {language === "fr" ? "Vérifier la Disponibilité" : language === "ar" ? "تحقق من التوفر" : "Check Availability"}
                </h3>
                <div className="mt-4 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      booked: (date) => isDateBooked(date),
                    }}
                    modifiersClassNames={{
                      booked: "!bg-destructive/15 !text-destructive line-through",
                    }}
                    className={cn("p-3 pointer-events-auto rounded-xl border-0")}
                  />
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-primary/20 border border-primary/30" />
                    {language === "fr" ? "Disponible" : language === "ar" ? "متاح" : "Available"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-destructive/15 border border-destructive/30" />
                    {language === "fr" ? "Réservé" : language === "ar" ? "محجوز" : "Booked"}
                  </span>
                </div>

                {/* Selected date status */}
                {selectedDate && (
                  <div className={cn(
                    "mt-4 rounded-xl px-4 py-3 text-center text-sm font-medium",
                    isSelectedBooked
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  )}>
                    {isSelectedBooked
                      ? (language === "fr" ? "❌ Cette date est réservée" : language === "ar" ? "❌ هذا التاريخ محجوز" : "❌ This date is booked")
                      : (language === "fr" ? "✅ Cette date est disponible !" : language === "ar" ? "✅ هذا التاريخ متاح!" : "✅ This date is available!")}
                  </div>
                )}
              </div>
            )}

            {/* Agent card */}
            {agent && (
              <div className="premium-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">{t("detail.contactAgent")}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <img src={agent.photo} alt={agent.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/10" />
                  <div>
                    <p className="font-display font-semibold text-card-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{agentBio}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Phone className="h-4 w-4 text-primary" /> {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Mail className="h-4 w-4 text-primary" /> {agent.email}
                  </a>
                </div>
              </div>
            )}

            {/* Inquiry form */}
            <div className="premium-card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">{t("detail.inquiry")}</h3>
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <Input
                  placeholder={t("detail.name")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder={t("detail.email")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
                <Input
                  type="tel"
                  placeholder={t("detail.phone")}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 rounded-xl"
                />
                <Textarea
                  placeholder={t("detail.message")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                  className="rounded-xl resize-none"
                />
                <Button type="submit" className="w-full gradient-cta h-11 rounded-xl gap-2">
                  <Send className="h-4 w-4" />
                  {t("detail.send")}
                </Button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
