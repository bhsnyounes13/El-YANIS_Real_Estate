import { useLanguage } from "@/i18n/LanguageContext";
import { agents } from "@/data/mockData";
import { Phone, Mail, Star } from "lucide-react";

const Agents = () => {
  const { language } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-gold/15 blur-[100px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Notre Équipe" : language === "ar" ? "فريقنا" : "Our Team"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr" ? "Nos Agents Experts" : language === "ar" ? "وكلاؤنا الخبراء" : "Our Expert Agents"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr" ? "Des professionnels dévoués à votre réussite immobilière" : language === "ar" ? "محترفون مكرسون لنجاحك العقاري" : "Dedicated professionals committed to your real estate success"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Agents Grid */}
      <section className="container py-20">
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {agents.map((agent, i) => {
            const bio = agent[`bio_${language}` as keyof typeof agent] as string;
            return (
              <div key={agent.id} className="premium-card p-8 text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="mx-auto h-28 w-28 rounded-2xl object-cover ring-4 ring-primary/10 transition-all duration-500 group-hover:ring-primary/25 group-hover:scale-105"
                />
                <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">{agent.name}</h3>
                <div className="mx-auto mt-2 gold-line" />
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{bio}</p>
                <div className="mt-5 flex flex-col gap-2">
                  <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Phone className="h-4 w-4 text-primary" /> {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Mail className="h-4 w-4 text-primary" /> {agent.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Join CTA */}
      <section className="container pb-20">
        <div className="premium-card p-10 text-center md:p-16">
          <h2 className="font-heading text-3xl font-bold text-card-foreground">
            {language === "fr" ? "Rejoignez Notre Équipe" : language === "ar" ? "انضم إلى فريقنا" : "Join Our Team"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {language === "fr" ? "Nous recherchons des agents passionnés par l'immobilier" : language === "ar" ? "نبحث عن وكلاء شغوفين بالعقارات" : "We're looking for passionate real estate professionals"}
          </p>
          <div className="mx-auto mt-4 gold-line" />
          <a href="/contact" className="mt-8 inline-block rounded-full gradient-cta px-8 py-3 text-sm font-semibold">
            {language === "fr" ? "Postuler" : language === "ar" ? "قدّم طلبك" : "Apply Now"}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Agents;
