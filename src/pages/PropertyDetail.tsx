import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/i18n/LanguageContext";
import { PropertyGallery } from "@/components/PropertyGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Check,
  Phone,
  Mail,
  Send,
  CalendarDays,
} from "lucide-react";
import { ApiErrorState } from "@/components/ApiErrorState";
import { useToast } from "@/hooks/use-toast";
import { useProperty } from "@/hooks/queries/useProperty";
import { useAgents } from "@/hooks/queries/useAgents";
import { usePropertyInquiry } from "@/hooks/mutations/usePropertyInquiry";
import { TurnstileField } from "@/components/security/TurnstileField";
import { useTurnstileSubmissionGate } from "@/hooks/useTurnstileSubmissionGate";
import {
  propertyInquiryPageSchema,
  type PropertyInquiryPageValues,
} from "@/lib/forms/publicFormSchemas";
import { getMutationErrorDescription, getQueryErrorDescription } from "@/lib/api/mapApiUserMessage";

const PropertyDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { data: property, isLoading, isError, error, refetch } = useProperty(id);
  const { data: agents = [] } = useAgents();
  const inquiry = usePropertyInquiry();
  const { turnstileToken, setTurnstileToken, turnstileRequired, canSubmitWithTurnstile } =
    useTurnstileSubmissionGate();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const form = useForm<PropertyInquiryPageValues>({
    resolver: zodResolver(propertyInquiryPageSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

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
  const isRent = property?.type === "rent";

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-8 aspect-[21/9] animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-16">
        <ApiErrorState
          title={t("toast.error")}
          description={getQueryErrorDescription(error, t)}
          onRetry={() => void refetch()}
          retryLabel={t("common.retry")}
        />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-24 text-center">
        <p className="text-lg text-muted-foreground">{t("detail.notFound")}</p>
        <Button asChild variant="outline" className="mt-8 rounded-full">
          <Link to="/listings">{t("detail.back")}</Link>
        </Button>
      </div>
    );
  }

  const agent = property.agent_id ? agents.find((a) => a.id === property.agent_id) : undefined;
  const title =
    (property[`title_${language}` as keyof typeof property] as string) ||
    property.title_fr ||
    property.title_en ||
    property.title_ar;
  const description =
    (property[`description_${language}` as keyof typeof property] as string) ||
    property.description_fr ||
    property.description_en ||
    property.description_ar;
  const agentBio = agent ? ((agent[`bio_${language}` as keyof typeof agent] as string) ?? "") : "";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(
      language === "ar" ? "ar-DZ" : language === "fr" ? "fr-DZ" : "en-US",
    ).format(price);

  const onSubmit = (values: PropertyInquiryPageValues) => {
    inquiry.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        message: values.message.trim(),
        propertyId: property.id,
        preferredDate: selectedDate?.toISOString(),
        turnstileToken,
      },
      {
        onSuccess: () => {
          toast({ title: t("toast.inquirySent"), description: t("toast.inquirySentDesc") });
          form.reset();
          setTurnstileToken(null);
        },
        onError: (err) =>
          toast({
            title: t("toast.error"),
            description: getMutationErrorDescription(err, t),
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <div className="container py-10 md:py-14" data-rent-context={isRent ? "true" : undefined}>
      <Link
        to="/listings"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        {t("detail.back")}
      </Link>

      <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:gap-14">
        <div className="min-w-0 flex-1 space-y-10">
          <PropertyGallery images={property.images} title={title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                  isRent ? "bg-rent-primary text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                {t(`type.${property.type}`)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant">
                <MapPin className={`h-4 w-4 ${isRent ? "text-rent-primary" : "text-primary"}`} />
                {t(`city.${property.city}`)}
              </span>
            </div>

            <h1 className="mt-5 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <span
                className={`font-heading text-3xl font-bold tracking-[-0.02em] md:text-4xl ${
                  isRent ? "text-rent-primary" : "text-primary"
                }`}
              >
                {formatPrice(property.price)} {t("property.dzd")}
              </span>
              {isRent && (
                <span className="text-base text-on-surface-variant">
                  /{language === "fr" ? "mois" : language === "ar" ? "شهر" : "mo"}
                </span>
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: BedDouble, value: property.bedrooms, label: t("property.beds") },
                { icon: Bath, value: property.bathrooms, label: t("property.baths") },
                { icon: Maximize, value: `${property.area}`, label: t("property.area") },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-surface-container px-3 py-4 text-center ring-1 ring-outline-variant/25"
                >
                  <stat.icon
                    className={`mx-auto h-5 w-5 ${isRent ? "text-rent-primary" : "text-primary"}`}
                  />
                  <div className="mt-2 font-heading text-xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-on-surface-variant">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4">
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
                {t("detail.description")}
              </h2>
              <p className="max-w-3xl text-[15px] leading-relaxed text-on-surface-variant">
                {description}
              </p>
            </div>

            <div className="mt-12">
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
                {t("detail.amenities")}
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-2xl bg-surface-container px-4 py-3 text-sm text-foreground"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        isRent ? "bg-rent-soft text-rent-primary" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-[380px]">
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            {isRent && (
              <div className="rounded-3xl bg-rent-soft p-6 ring-1 ring-rent-secondary/35">
                <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rent-primary">
                  <CalendarDays className="h-4 w-4" />
                  {t("detail.availability")}
                </h3>
                <div className="mt-4 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    modifiers={{ booked: (date) => isDateBooked(date) }}
                    modifiersClassNames={{
                      booked: "!bg-destructive/15 !text-destructive line-through",
                    }}
                    className={cn("pointer-events-auto rounded-2xl border-0 p-3")}
                  />
                </div>
                {selectedDate && (
                  <div
                    className={cn(
                      "mt-4 rounded-2xl px-4 py-3 text-center text-sm font-medium",
                      isSelectedBooked
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {isSelectedBooked ? t("detail.dateBooked") : t("detail.dateFree")}
                  </div>
                )}
              </div>
            )}

            {agent && (
              <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  {t("detail.contactAgent")}
                </h3>
                <div className="mt-4 flex items-center gap-3">
                  {agent.photo ? (
                    <img
                      src={agent.photo}
                      alt=""
                      className="h-14 w-14 rounded-2xl object-cover ring-1 ring-outline-variant/30"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container text-xs text-muted-foreground ring-1 ring-outline-variant/30">
                      Photo
                    </div>
                  )}
                  <div>
                    <p className="font-heading font-semibold text-foreground">{agent.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                      {agentBio}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-2 rounded-2xl bg-surface-container px-4 py-2.5 text-sm transition hover:bg-muted"
                  >
                    <Phone className="h-4 w-4 text-primary" /> {agent.phone}
                  </a>
                  {agent.email ? (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-2 rounded-2xl bg-surface-container px-4 py-2.5 text-sm transition hover:bg-muted"
                    >
                      <Mail className="h-4 w-4 text-primary" /> {agent.email}
                    </a>
                  ) : null}
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                {t("detail.inquiry")}
              </h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">{t("detail.name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("detail.name")}
                            className="luminous-input h-11 rounded-2xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">{t("detail.email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("detail.email")}
                            className="luminous-input h-11 rounded-2xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">{t("detail.phone")}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={t("detail.phone")}
                            className="luminous-input h-11 rounded-2xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">{t("detail.message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("detail.message")}
                            rows={4}
                            className="luminous-input rounded-2xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <TurnstileField onTokenChange={setTurnstileToken} />
                  <Button
                    type="submit"
                    disabled={inquiry.isPending || !canSubmitWithTurnstile}
                    title={
                      turnstileRequired && !canSubmitWithTurnstile
                        ? t("security.completeCaptcha")
                        : undefined
                    }
                    className={`h-11 w-full rounded-2xl font-semibold ${isRent ? "luminous-cta-rent" : "luminous-cta"}`}
                  >
                    <Send className="me-2 h-4 w-4" />
                    {t("detail.send")}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
