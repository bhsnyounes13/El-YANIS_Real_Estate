import { Link } from "react-router-dom";
import { ApiErrorState } from "@/components/ApiErrorState";
import { getQueryErrorDescription } from "@/lib/api/mapApiUserMessage";
import { useLanguage } from "@/i18n/LanguageContext";
import { PageHero } from "@/components/PageHero";
import { SectionShell } from "@/components/SectionShell";
import { Button } from "@/components/ui/button";
import { useAgents } from "@/hooks/queries/useAgents";
import { Phone, Mail, Star } from "lucide-react";

const Agents = () => {
  const { language, t } = useLanguage();
  const { data: agents = [], isLoading, isError, error, refetch } = useAgents();

  return (
    <div>
      <PageHero
        eyebrow={language === "fr" ? "Confiance" : language === "ar" ? "الثقة" : "Trust"}
        title={
          language === "fr"
            ? "Les conseillers EL-YANIS"
            : language === "ar"
              ? "مستشارو العنيس"
              : "EL-YANIS advisors"
        }
        description={
          language === "fr"
            ? "Des profils seniors, ancrés dans l’ouest algérien, avec une approche calme et structurée."
            : language === "ar"
              ? "ملفات ذات خبرة في غرب الجزائر، بأسلوب هادئ ومنظم."
              : "Senior profiles rooted in western Algeria, with a calm and structured approach."
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
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {agents.map((agent) => {
                const bio = agent[`bio_${language}` as keyof typeof agent] as string;
                return (
                  <div
                    key={agent.id}
                    className="luminous-card-quiet flex flex-col p-8 text-center md:p-10"
                  >
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="mx-auto h-28 w-28 rounded-3xl object-cover ring-1 ring-outline-variant/30"
                    />
                    <h3 className="mt-6 font-heading text-xl font-semibold tracking-[-0.02em]">
                      {agent.name}
                    </h3>
                    <div className="mx-auto mt-3 flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-primary/25 text-primary" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{bio}</p>
                    <div className="mt-6 flex flex-col gap-2">
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container px-4 py-2.5 text-sm transition hover:bg-muted"
                      >
                        <Phone className="h-4 w-4 text-primary" /> {agent.phone}
                      </a>
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container px-4 py-2.5 text-sm transition hover:bg-muted"
                      >
                        <Mail className="h-4 w-4 text-primary" /> {agent.email}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionShell>

      <SectionShell tone="muted">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.02em]">
            {language === "fr"
              ? "Rejoindre le réseau"
              : language === "ar"
                ? "انضم للشبكة"
                : "Join the network"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-on-surface-variant">
            {language === "fr"
              ? "Nous accueillons les talents immobiliers partageant notre exigence éditoriale."
              : language === "ar"
                ? "نرحب بالمواهب التي تشاركنا نفس المستوى من الاحترافية."
                : "We welcome real estate talent that shares our editorial standards."}
          </p>
          <Button asChild className="mt-8 rounded-full px-10 font-semibold luminous-cta">
            <Link to="/contact">
              {language === "fr"
                ? "Écrire au studio"
                : language === "ar"
                  ? "راسلنا"
                  : "Write to us"}
            </Link>
          </Button>
        </div>
      </SectionShell>
    </div>
  );
};

export default Agents;
