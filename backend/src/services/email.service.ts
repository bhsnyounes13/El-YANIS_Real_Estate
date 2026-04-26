import { config } from "../config.js";
import { isFormNotificationEnabled, sendMail } from "./mailer.js";

type ContactFields = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

type InquiryFields = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredDate?: string;
  propertyId: string;
};

export { isFormNotificationEnabled };

/** @deprecated Préférer `isFormNotificationEnabled` depuis `mailer.js` */
export function isSmtpNotificationEnabled(): boolean {
  return isFormNotificationEnabled();
}

export async function notifyNewContactForm(id: string, fields: ContactFields): Promise<void> {
  const to = config.smtp.notifyTo;
  if (!to) return;
  if (!isFormNotificationEnabled()) return;

  const subject = `[EL-YANIS] Contact — ${fields.subject || "(sans sujet)"}`;
  const text = [
    `Nouveau message de contact (id: ${id})`,
    "",
    `Nom : ${fields.name}`,
    `E-mail : ${fields.email}`,
    `Tél. : ${fields.phone ?? "—"}`,
    `Sujet : ${fields.subject ?? "—"}`,
    "",
    fields.message,
  ].join("\n");

  await sendMail({
    to,
    subject,
    text,
    replyTo: fields.email,
  });
}

export async function notifyNewPropertyInquiry(
  id: string,
  fields: InquiryFields,
): Promise<void> {
  const to = config.smtp.notifyTo;
  if (!to) return;
  if (!isFormNotificationEnabled()) return;

  const subject = `[EL-YANIS] Demande de visite / bien — ${id.slice(0, 8)}…`;
  const text = [
    `Nouvelle demande liée à un bien (id: ${id})`,
    "",
    `Bien (id) : ${fields.propertyId}`,
    `Nom : ${fields.name}`,
    `E-mail : ${fields.email}`,
    `Tél. : ${fields.phone ?? "—"}`,
    `Date souhaitée : ${fields.preferredDate ?? "—"}`,
    "",
    fields.message,
  ].join("\n");

  await sendMail({
    to,
    subject,
    text,
    replyTo: fields.email,
  });
}
