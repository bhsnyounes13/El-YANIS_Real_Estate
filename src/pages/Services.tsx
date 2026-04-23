import { Link } from "react-router-dom";
import { ApiErrorState } from "@/components/ApiErrorState";
import { getQueryErrorDescription } from "@/lib/api/mapApiUserMessage";
import { useLanguage } from "@/i18n/LanguageContext";
import { PageHero } from "@/components/PageHero";
import { SectionShell } from "@/components/SectionShell";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/queries/useServices";
import {
  Building2,
  TrendingUp,
  Handshake,
  FileText,
  Scale,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  building: Building2,
  trending: TrendingUp,
  handshake: Handshake,
  file: FileText,
  scale: Scale,
  paint: Paintbrush,
};

const Services = () => {
  const { language, t } = useLanguage();
  const { data: services = [], isLoading, isError, refetch } = useServices();

  return (
    <div>
      <PageHero
        eyebrow={language === "fr" ? "Expertise" : language === "ar" ? "الخبرة" : "Expertise"}
        title={language === "fr" ? "Nos services" : language === "ar" ? "خدماتنا" : "Our services"}
        description={
          language === "fr"
            ? "Un accompagnement architectural, du premier conseil à la signature."
            : language === "ar"
              ? "مرافقة معمارية من أول استشارة حتى التوقيع."
              : "Architectural guidance from first advice to signature."
        }
      />

      <SectionShell>
        <div className="container">
          {isError ? (
            <ApiErrorState
              title={t("toast.error")}
              description={getQueryErrorDescription(error, t)}
              onRetry={() => void refetch()}
              retryLabel={t("common.retry")}
            />
          ) : isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = ICONS[service.iconKey] ?? Building2;
                const title = service[`title_${language}` as keyof typeof service] as string;
                const desc = service[`description_${language}` as keyof typeof service] as string;
                return (
                  <div key={service.id} className="luminous-card-quiet p-8 md:p-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-heading text-xl font-semibold tracking-[-0.02em]">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionShell>

      <SectionShell tone="muted">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] md:text-4xl">
            {language === "fr"
              ? "Un projet sur mesure ?"
              : language === "ar"
                ? "مشروع مخصص؟"
                : "A tailored project?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-on-surface-variant">
            {language === "fr"
              ? "Parlons de votre besoin — nous orchestrons chaque étape avec discrétion."
              : language === "ar"
                ? "لنناقش احتياجك — ننسق كل خطوة بكل احترافية وهدوء."
                : "Tell us what you need — we orchestrate every step with discretion."}
          </p>
          <Button asChild className="mt-8 rounded-full px-10 font-semibold luminous-cta">
            <Link to="/contact">
              {language === "fr" ? "Contact" : language === "ar" ? "اتصل" : "Contact"}
            </Link>
          </Button>
        </div>
      </SectionShell>
    </div>
  );
};

export default Services;
