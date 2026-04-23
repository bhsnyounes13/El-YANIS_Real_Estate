import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/i18n/LanguageContext";
import { PageHero } from "@/components/PageHero";
import { ContactCard } from "@/components/ContactCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useContactInquiry } from "@/hooks/mutations/useContactInquiry";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { TurnstileField } from "@/components/security/TurnstileField";
import { useTurnstileSubmissionGate } from "@/hooks/useTurnstileSubmissionGate";
import { contactPageFormSchema, type ContactPageFormValues } from "@/lib/forms/publicFormSchemas";
import { getMutationErrorDescription } from "@/lib/api/mapApiUserMessage";

const Contact = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const mutation = useContactInquiry();
  const { turnstileToken, setTurnstileToken, turnstileRequired, canSubmitWithTurnstile } =
    useTurnstileSubmissionGate();

  const form = useForm<ContactPageFormValues>({
    resolver: zodResolver(contactPageFormSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = (values: ContactPageFormValues) => {
    const phone = values.phone?.trim() || undefined;
    const subject = values.subject?.trim() || undefined;
    mutation.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        phone,
        subject,
        message: values.message.trim(),
        turnstileToken,
      },
      {
        onSuccess: () => {
          toast({ title: t("toast.contactSent"), description: t("toast.contactSentDesc") });
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

  const contactInfo = [
    {
      icon: Phone,
      title: { en: "Phone", fr: "Téléphone", ar: "الهاتف" },
      value: "+213 555 123 456",
      href: "tel:+213555123456",
    },
    {
      icon: Mail,
      title: { en: "Email", fr: "Email", ar: "البريد الإلكتروني" },
      value: "contact@elyainis.com",
      href: "mailto:contact@elyainis.com",
    },
    {
      icon: MapPin,
      title: { en: "Address", fr: "Adresse", ar: "العنوان" },
      value:
        language === "fr"
          ? "Centre-ville, Tlemcen"
          : language === "ar"
            ? "وسط تلمسان"
            : "Tlemcen city center",
    },
    {
      icon: Clock,
      title: { en: "Hours", fr: "Horaires", ar: "الساعات" },
      value:
        language === "fr"
          ? "Dim — Jeu · 9h — 18h"
          : language === "ar"
            ? "الأحد — الخميس · 9 — 18"
            : "Sun — Thu · 9AM — 6PM",
    },
  ];

  return (
    <div>
      <PageHero
        variant="soft"
        eyebrow={t("contact.heroEyebrow")}
        title={t("contact.heroTitle")}
        description={t("contact.heroDesc")}
      />

      <section className="container py-16 md:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, i) => (
            <ContactCard
              key={i}
              icon={info.icon}
              title={info.title[language]}
              value={info.value}
              href={info.href}
              external={info.href?.startsWith("http")}
            />
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20 md:p-10">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
                {t("contact.formTitle")}
              </h2>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("detail.name")}</FormLabel>
                        <FormControl>
                          <Input className="luminous-input h-11 rounded-2xl" {...field} />
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
                        <FormLabel>{t("detail.email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="luminous-input h-11 rounded-2xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("detail.phone")}</FormLabel>
                      <FormControl>
                        <Input type="tel" className="luminous-input h-11 rounded-2xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.subject")}</FormLabel>
                      <FormControl>
                        <Input className="luminous-input h-11 rounded-2xl" {...field} />
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
                      <FormLabel>{t("detail.message")}</FormLabel>
                      <FormControl>
                        <Textarea rows={5} className="luminous-input rounded-2xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <TurnstileField onTokenChange={setTurnstileToken} />
                <Button
                  type="submit"
                  disabled={mutation.isPending || !canSubmitWithTurnstile}
                  className="h-12 w-full rounded-2xl font-semibold luminous-cta"
                  title={
                    turnstileRequired && !canSubmitWithTurnstile
                      ? t("security.completeCaptcha")
                      : undefined
                  }
                >
                  <Send className="me-2 h-4 w-4" />
                  {t("contact.submit")}
                </Button>
              </form>
            </Form>
          </div>

          <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-ambient)] ring-1 ring-outline-variant/20">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104571.35905671856!2d-1.3650387!3d34.8826946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd78c94ab5d38c87%3A0x1c5e8b7a2c3d4e5f!2sTlemcen!5e0!3m2!1sfr!2sdz!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-surface-container px-8 py-12 text-center shadow-[var(--shadow-ambient)] md:px-14">
          <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] md:text-3xl">
            {t("contact.whatsappTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-on-surface-variant">
            {t("contact.whatsappDesc")}
          </p>
          <a
            href="https://wa.me/213555123456"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold luminous-cta"
          >
            <MessageCircle className="h-4 w-4" />
            {t("contact.whatsappCta")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
