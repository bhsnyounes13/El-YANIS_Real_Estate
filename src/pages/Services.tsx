import { useLanguage } from "@/i18n/LanguageContext";
import { Building2, TrendingUp, Handshake, FileText, Scale, Paintbrush } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: { en: "Property Sales", fr: "Vente Immobilière", ar: "بيع العقارات" },
    desc: { en: "We help you sell your property at the best market value with professional marketing, photography, and negotiation support.", fr: "Nous vous aidons à vendre votre propriété au meilleur prix du marché avec un marketing professionnel, des photos et un soutien à la négociation.", ar: "نساعدك في بيع عقارك بأفضل قيمة سوقية مع التسويق الاحترافي والتصوير ودعم التفاوض." },
  },
  {
    icon: TrendingUp,
    title: { en: "Property Investment", fr: "Investissement Immobilier", ar: "الاستثمار العقاري" },
    desc: { en: "Expert guidance on real estate investment opportunities across western Algeria with detailed market analysis and ROI projections.", fr: "Conseils d'experts sur les opportunités d'investissement immobilier dans l'ouest algérien avec des analyses de marché détaillées.", ar: "إرشادات خبيرة حول فرص الاستثمار العقاري في غرب الجزائر مع تحليل مفصل للسوق." },
  },
  {
    icon: Handshake,
    title: { en: "Property Rental", fr: "Location Immobilière", ar: "تأجير العقارات" },
    desc: { en: "Find the perfect rental property or list your property for rent with our comprehensive tenant screening and management services.", fr: "Trouvez la propriété locative idéale ou mettez votre bien en location avec nos services complets de sélection et de gestion des locataires.", ar: "اعثر على العقار المثالي للإيجار أو اعرض عقارك للإيجار مع خدمات فحص وإدارة المستأجرين الشاملة." },
  },
  {
    icon: FileText,
    title: { en: "Legal Assistance", fr: "Assistance Juridique", ar: "المساعدة القانونية" },
    desc: { en: "Navigate the legal complexities of real estate transactions with our experienced legal team handling contracts, permits, and documentation.", fr: "Naviguez dans les complexités juridiques des transactions immobilières avec notre équipe juridique expérimentée.", ar: "تعامل مع التعقيدات القانونية للمعاملات العقارية مع فريقنا القانوني ذو الخبرة." },
  },
  {
    icon: Scale,
    title: { en: "Property Valuation", fr: "Évaluation Immobilière", ar: "تقييم العقارات" },
    desc: { en: "Accurate property valuation services using advanced market data analysis and professional assessment methodologies.", fr: "Services d'évaluation immobilière précis utilisant l'analyse avancée des données du marché et des méthodologies d'évaluation professionnelles.", ar: "خدمات تقييم عقاري دقيقة باستخدام تحليل بيانات السوق المتقدم ومنهجيات التقييم المهنية." },
  },
  {
    icon: Paintbrush,
    title: { en: "Interior Design", fr: "Design d'Intérieur", ar: "التصميم الداخلي" },
    desc: { en: "Transform your property with our interior design consultation services, creating spaces that reflect your style and maximize value.", fr: "Transformez votre propriété avec nos services de consultation en design d'intérieur, créant des espaces qui reflètent votre style.", ar: "حوّل عقارك مع خدمات استشارات التصميم الداخلي، لإنشاء مساحات تعكس أسلوبك وتزيد القيمة." },
  },
];

const Services = () => {
  const { language } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Ce Que Nous Offrons" : language === "ar" ? "ما نقدمه" : "What We Offer"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr" ? "Nos Services" : language === "ar" ? "خدماتنا" : "Our Services"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr" ? "Des solutions immobilières complètes adaptées à vos besoins" : language === "ar" ? "حلول عقارية شاملة مصممة لتلبية احتياجاتك" : "Comprehensive real estate solutions tailored to your needs"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div key={i} className="premium-card p-8 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">
                {service.title[language]}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {service.desc[language]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="premium-card p-10 text-center md:p-16">
          <h2 className="font-heading text-3xl font-bold text-card-foreground">
            {language === "fr" ? "Besoin d'un Service Personnalisé ?" : language === "ar" ? "هل تحتاج خدمة مخصصة؟" : "Need a Customized Service?"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {language === "fr" ? "Contactez-nous pour discuter de vos besoins spécifiques" : language === "ar" ? "تواصل معنا لمناقشة احتياجاتك الخاصة" : "Get in touch to discuss your specific requirements"}
          </p>
          <div className="mx-auto mt-4 gold-line" />
          <a href="/contact" className="mt-8 inline-block rounded-full gradient-cta px-8 py-3 text-sm font-semibold">
            {language === "fr" ? "Contactez-nous" : language === "ar" ? "اتصل بنا" : "Contact Us"}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
