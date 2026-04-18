import { useLanguage } from "@/i18n/LanguageContext";
import { Target, Eye, Award, Users, Building2, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.jpg";

const About = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Award,
      title: { en: "Excellence", fr: "Excellence", ar: "التميز" },
      desc: { en: "We strive for the highest standards in every transaction and client interaction.", fr: "Nous visons les plus hauts standards dans chaque transaction et interaction client.", ar: "نسعى لأعلى المعايير في كل معاملة وتفاعل مع العملاء." },
    },
    {
      icon: Users,
      title: { en: "Trust", fr: "Confiance", ar: "الثقة" },
      desc: { en: "Building lasting relationships through transparency, honesty, and integrity.", fr: "Construire des relations durables grâce à la transparence, l'honnêteté et l'intégrité.", ar: "بناء علاقات دائمة من خلال الشفافية والصدق والنزاهة." },
    },
    {
      icon: TrendingUp,
      title: { en: "Innovation", fr: "Innovation", ar: "الابتكار" },
      desc: { en: "Leveraging modern tools and strategies to deliver the best results for our clients.", fr: "Utiliser des outils et stratégies modernes pour offrir les meilleurs résultats.", ar: "استخدام الأدوات والاستراتيجيات الحديثة لتقديم أفضل النتائج لعملائنا." },
    },
  ];

  const stats = [
    { value: "500+", label: { en: "Properties Sold", fr: "Propriétés Vendues", ar: "عقار مباع" } },
    { value: "15+", label: { en: "Years Experience", fr: "Années d'Expérience", ar: "سنة خبرة" } },
    { value: "200+", label: { en: "Happy Clients", fr: "Clients Satisfaits", ar: "عميل سعيد" } },
    { value: "98%", label: { en: "Satisfaction Rate", fr: "Taux de Satisfaction", ar: "نسبة الرضا" } },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute top-20 right-1/3 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Notre Histoire" : language === "ar" ? "قصتنا" : "Our Story"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr" ? "À Propos d'EL-YANIS" : language === "ar" ? "حول العنيس" : "About EL-YANIS"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr" ? "Votre partenaire de confiance pour l'immobilier premium en Algérie occidentale" : language === "ar" ? "شريكك الموثوق للعقارات الفاخرة في غرب الجزائر" : "Your trusted partner for premium real estate in western Algeria"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Story Section */}
      <section className="container py-20">
        <div className="grid gap-12 items-center md:grid-cols-2">
          <div className="animate-fade-in-up">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
              {language === "fr" ? "Qui Sommes-Nous" : language === "ar" ? "من نحن" : "Who We Are"}
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">
              {language === "fr" ? "Bâtir des Rêves Depuis 2009" : language === "ar" ? "نبني الأحلام منذ 2009" : "Building Dreams Since 2009"}
            </h2>
            <div className="mt-3 gold-line" />
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Fondée à Tlemcen, EL-YANIS Real Estate s'est imposée comme le leader de l'immobilier haut de gamme dans l'ouest algérien. Notre équipe d'experts passionnés accompagne chaque client avec dévouement, de la première visite jusqu'à la remise des clés."
                : language === "ar"
                ? "تأسست العنيس للعقارات في تلمسان، وأصبحت الشركة الرائدة في مجال العقارات الفاخرة في غرب الجزائر. يرافق فريقنا من الخبراء المتحمسين كل عميل بتفانٍ، من الزيارة الأولى حتى تسليم المفاتيح."
                : "Founded in Tlemcen, EL-YANIS Real Estate has established itself as the leading premium real estate agency in western Algeria. Our team of passionate experts accompanies each client with dedication, from the first visit to the key handover."}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Avec une présence forte à Tlemcen, Ain Temouchent et Sidi Bel Abbès, nous offrons une couverture complète du marché immobilier de la région."
                : language === "ar"
                ? "مع وجود قوي في تلمسان وعين تموشنت وسيدي بلعباس، نقدم تغطية شاملة لسوق العقارات في المنطقة."
                : "With a strong presence in Tlemcen, Ain Temouchent, and Sidi Bel Abbès, we offer comprehensive coverage of the region's real estate market."}
            </p>
          </div>
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <div className="premium-card p-8 flex items-center justify-center">
                <img src={logo} alt="EL-YANIS" className="w-48 h-48 object-contain" />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl gradient-cta px-5 py-3 text-center">
                <div className="text-2xl font-bold font-display">15+</div>
                <div className="text-xs uppercase tracking-wider opacity-80">
                  {language === "fr" ? "Ans" : language === "ar" ? "سنة" : "Years"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="premium-card p-8 animate-fade-in-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-card-foreground">
              {language === "fr" ? "Notre Mission" : language === "ar" ? "مهمتنا" : "Our Mission"}
            </h3>
            <div className="mt-2 gold-line" />
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Offrir une expérience immobilière d'exception en combinant expertise locale, service personnalisé et technologies innovantes pour répondre aux aspirations de nos clients."
                : language === "ar"
                ? "تقديم تجربة عقارية استثنائية من خلال الجمع بين الخبرة المحلية والخدمة الشخصية والتقنيات المبتكرة لتلبية تطلعات عملائنا."
                : "To deliver an exceptional real estate experience by combining local expertise, personalized service, and innovative technologies to meet our clients' aspirations."}
            </p>
          </div>
          <div className="premium-card p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10">
              <Eye className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-card-foreground">
              {language === "fr" ? "Notre Vision" : language === "ar" ? "رؤيتنا" : "Our Vision"}
            </h3>
            <div className="mt-2 gold-line" />
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Devenir la référence incontournable de l'immobilier premium en Algérie, reconnue pour notre intégrité, notre innovation et notre engagement envers l'excellence."
                : language === "ar"
                ? "أن نصبح المرجع الأول في مجال العقارات الفاخرة في الجزائر، والمعروف بنزاهتنا وابتكارنا والتزامنا بالتميز."
                : "To become the definitive reference for premium real estate in Algeria, recognized for our integrity, innovation, and commitment to excellence."}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
              {language === "fr" ? "Nos Valeurs" : language === "ar" ? "قيمنا" : "Our Values"}
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">
              {language === "fr" ? "Ce Qui Nous Guide" : language === "ar" ? "ما يوجهنا" : "What Guides Us"}
            </h2>
            <div className="mx-auto mt-4 gold-line" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={i} className="premium-card p-8 text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">{v.title[language]}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.desc[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container pb-20">
        <div className="premium-card p-10 md:p-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl font-bold font-display text-gradient md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-display">{stat.label[language]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
