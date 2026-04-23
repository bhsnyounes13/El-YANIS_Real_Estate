import { useLanguage } from "@/i18n/LanguageContext";
import { PageHero } from "@/components/PageHero";
import { SectionShell } from "@/components/SectionShell";
import { EditorialQuote } from "@/components/EditorialQuote";
import { StatStrip } from "@/components/StatStrip";
import { Target, Eye, Award, Users, TrendingUp, Building2 } from "lucide-react";
import logo from "@/assets/logo.jpg";

const About = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Award,
      title: { en: "Excellence", fr: "Excellence", ar: "التميز" },
      desc: {
        en: "Measured craft in every mandate — from valuation to closing.",
        fr: "Une exigence mesurée sur chaque mandat — de l’estimation à la signature.",
        ar: "إتقان مدروس في كل تفويض — من التقييم إلى الإغلاق.",
      },
    },
    {
      icon: Users,
      title: { en: "Trust", fr: "Confiance", ar: "الثقة" },
      desc: {
        en: "Transparent counsel, documented processes, long-term relationships.",
        fr: "Conseil transparent, processus documentés, relations dans la durée.",
        ar: "استشارة شفافة، عمليات موثقة، علاقات طويلة الأمد.",
      },
    },
    {
      icon: TrendingUp,
      title: { en: "Innovation", fr: "Innovation", ar: "الابتكار" },
      desc: {
        en: "Digital tools that stay quiet — supporting decisions, not noise.",
        fr: "Des outils numériques discrets — au service des décisions, pas du bruit.",
        ar: "أدوات رقمية هادئة تدعم القرار دون ضجيج.",
      },
    },
  ];

  const stats = [
    { value: "500+", label: { en: "Mandates", fr: "Mandats", ar: "تفويض" } },
    { value: "15+", label: { en: "Years", fr: "Années", ar: "سنوات" } },
    { value: "200+", label: { en: "Clients", fr: "Clients", ar: "عميل" } },
    { value: "98%", label: { en: "Satisfaction", fr: "Satisfaction", ar: "رضا" } },
  ];

  const quote =
    language === "fr"
      ? "L’immobilier n’est pas une liste d’annonces — c’est une suite de décisions patiemment éclairées."
      : language === "ar"
        ? "العقار ليس قائمة إعلانات — إنه سلسلة قرارات مدروسة بهدوء."
        : "Real estate is not a feed of listings — it is a sequence of patiently informed decisions.";

  return (
    <div>
      <PageHero
        eyebrow={language === "fr" ? "Maison" : language === "ar" ? "الهوية" : "House"}
        title={
          language === "fr"
            ? "EL-YANIS, une signature immobilière"
            : language === "ar"
              ? "العنيس، توقيع عقاري"
              : "EL-YANIS, a real estate signature"
        }
        description={
          language === "fr"
            ? "Nous sculptons des parcours d’achat et de location pour clients exigeants, entre Tlemcen et la côte."
            : language === "ar"
              ? "نصمم رحلات بيع وإيجار لعملاء يقدرون الدقة، بين تلمسان والساحل."
              : "We shape purchase and rental journeys for discerning clients across Tlemcen and the coast."
        }
      />

      <SectionShell>
        <div className="container">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                {language === "fr" ? "Manifeste" : language === "ar" ? "البيان" : "Manifesto"}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                {language === "fr"
                  ? "Une présence locale, une ambition internationale"
                  : language === "ar"
                    ? "حضور محلي وطموح بمستوى عالمي"
                    : "Local presence, international poise"}
              </h2>
              <p className="mt-6 text-on-surface-variant leading-relaxed">
                {language === "fr"
                  ? "Fondée à Tlemcen, EL-YANIS relie marchés, juristes et artisans pour sécuriser chaque transaction."
                  : language === "ar"
                    ? "تأسست في تلمسان، تربط العنيس الأسواق والقانونيين والحرفيين لتأمين كل معاملة."
                    : "Founded in Tlemcen, EL-YANIS connects markets, legal counsel, and craftspeople to secure every transaction."}
              </p>
              <p className="mt-4 text-on-surface-variant leading-relaxed">
                {language === "fr"
                  ? "Notre équipe suit un protocole éditorial : moins d’effets, plus de matière."
                  : language === "ar"
                    ? "فريقنا يتبع بروتوكولاً تحريرياً: أقل زخرفة، وأكثر عمقاً."
                    : "Our team follows an editorial protocol: fewer effects, more substance."}
              </p>
            </div>
            <div className="relative flex justify-center">
              <div className="relative rounded-3xl bg-card p-10 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/25">
                <img src={logo} alt="EL-YANIS" className="mx-auto h-44 w-44 object-contain" />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <EditorialQuote quote={quote} />
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="muted">
        <div className="container grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-heading text-2xl font-semibold">
              {language === "fr" ? "Mission" : language === "ar" ? "المهمة" : "Mission"}
            </h3>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              {language === "fr"
                ? "Donner aux familles et aux investisseurs une lecture claire du marché ouest-algérien."
                : language === "ar"
                  ? "منح العائلات والمستثمرين قراءة واضحة لسوق غرب الجزائر."
                  : "Give families and investors a clear read of the western Algerian market."}
            </p>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-heading text-2xl font-semibold">
              {language === "fr" ? "Vision" : language === "ar" ? "الرؤية" : "Vision"}
            </h3>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              {language === "fr"
                ? "Être la référence silencieuse mais incontournable du premium immobilier régional."
                : language === "ar"
                  ? "أن نكون المرجع الهادئ لكن الجوهري للعقار الفاخر محلياً."
                  : "To be the quiet yet definitive reference for regional premium real estate."}
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="container">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              {language === "fr" ? "Valeurs" : language === "ar" ? "القيم" : "Values"}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em]">
              {language === "fr"
                ? "Ce qui nous structure"
                : language === "ar"
                  ? "ما يهيكلنا"
                  : "What structures us"}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={i} className="luminous-card-quiet p-8 text-center md:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold">{v.title[language]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {v.desc[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="muted">
        <div className="container">
          <div className="mb-10 flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
              {language === "fr" ? "Indicateurs" : language === "ar" ? "مؤشرات" : "Signals"}
            </h2>
          </div>
          <StatStrip
            stats={stats.map((s) => ({
              value: s.value,
              label: s.label[language],
            }))}
          />
        </div>
      </SectionShell>
    </div>
  );
};

export default About;
