import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

const Contact = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === "fr" ? "Message envoyé !" : language === "ar" ? "تم إرسال الرسالة!" : "Message sent!",
      description: language === "fr" ? "Nous vous répondrons dans les plus brefs délais." : language === "ar" ? "سنرد عليك في أقرب وقت ممكن." : "We'll get back to you as soon as possible.",
    });
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: { en: "Phone", fr: "Téléphone", ar: "الهاتف" },
      value: "+213 555 123 456",
      link: "tel:+213555123456",
    },
    {
      icon: Mail,
      title: { en: "Email", fr: "Email", ar: "البريد الإلكتروني" },
      value: "contact@elyainis.com",
      link: "mailto:contact@elyainis.com",
    },
    {
      icon: MapPin,
      title: { en: "Address", fr: "Adresse", ar: "العنوان" },
      value: language === "fr" ? "Centre-ville, Tlemcen, Algérie" : language === "ar" ? "وسط المدينة، تلمسان، الجزائر" : "City Center, Tlemcen, Algeria",
      link: "https://maps.google.com/?q=Tlemcen,Algeria",
    },
    {
      icon: Clock,
      title: { en: "Working Hours", fr: "Horaires", ar: "ساعات العمل" },
      value: language === "fr" ? "Dim - Jeu: 9h - 18h" : language === "ar" ? "الأحد - الخميس: 9 - 18" : "Sun - Thu: 9AM - 6PM",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-gold/15 blur-[100px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Parlons-en" : language === "ar" ? "لنتحدث" : "Get In Touch"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr" ? "Contactez-nous" : language === "ar" ? "اتصل بنا" : "Contact Us"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr" ? "Nous sommes là pour répondre à toutes vos questions immobilières" : language === "ar" ? "نحن هنا للإجابة على جميع أسئلتك العقارية" : "We're here to answer all your real estate questions"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container py-20">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-14">
          {contactInfo.map((info, i) => (
            <a
              key={i}
              href={info.link}
              target={info.link?.startsWith("http") ? "_blank" : undefined}
              rel={info.link?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="premium-card p-6 text-center group hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20">
                <info.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">{info.title[language]}</h3>
              <p className="mt-1 text-sm font-medium text-card-foreground">{info.value}</p>
            </a>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <div className="premium-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-semibold text-card-foreground">
                {language === "fr" ? "Envoyez-nous un Message" : language === "ar" ? "أرسل لنا رسالة" : "Send Us a Message"}
              </h2>
            </div>
            <div className="gold-line mb-6" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder={language === "fr" ? "Votre Nom" : language === "ar" ? "اسمك" : "Your Name"}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder={language === "fr" ? "Votre Email" : language === "ar" ? "بريدك الإلكتروني" : "Your Email"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="tel"
                  placeholder={language === "fr" ? "Votre Téléphone" : language === "ar" ? "هاتفك" : "Your Phone"}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-11 rounded-xl"
                />
                <Input
                  placeholder={language === "fr" ? "Sujet" : language === "ar" ? "الموضوع" : "Subject"}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <Textarea
                placeholder={language === "fr" ? "Votre Message" : language === "ar" ? "رسالتك" : "Your Message"}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                required
                className="rounded-xl resize-none"
              />
              <Button type="submit" className="w-full gradient-cta h-12 rounded-xl gap-2 text-base">
                <Send className="h-4 w-4" />
                {language === "fr" ? "Envoyer le Message" : language === "ar" ? "إرسال الرسالة" : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Map */}
          <div className="premium-card overflow-hidden">
            <iframe
              title="EL-YANIS Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104571.35905671856!2d-1.3650387!3d34.8826946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd78c94ab5d38c87%3A0x1c5e8b7a2c3d4e5f!2sTlemcen!5e0!3m2!1sfr!2sdz!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container pb-20">
        <div className="premium-card p-10 text-center md:p-14">
          <h2 className="font-heading text-3xl font-bold text-card-foreground">
            {language === "fr" ? "Préférez WhatsApp ?" : language === "ar" ? "هل تفضل واتساب؟" : "Prefer WhatsApp?"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {language === "fr" ? "Envoyez-nous un message directement sur WhatsApp pour une réponse rapide" : language === "ar" ? "أرسل لنا رسالة مباشرة على واتساب للحصول على رد سريع" : "Send us a message directly on WhatsApp for a quick response"}
          </p>
          <div className="mx-auto mt-4 gold-line" />
          <a
            href="https://wa.me/213555123456"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full gradient-cta-gold px-8 py-3 text-sm font-semibold"
          >
            <MessageCircle className="h-4 w-4" />
            {language === "fr" ? "Discuter sur WhatsApp" : language === "ar" ? "تحدث عبر واتساب" : "Chat on WhatsApp"}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
