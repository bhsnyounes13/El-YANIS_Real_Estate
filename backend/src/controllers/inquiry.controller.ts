import type { Request, Response } from "express";
import * as inquiryService from "../services/inquiry.service.js";
import {
  contactPublicSchema,
  propertyInquiryPublicSchema,
} from "../validators/schemas.js";
import { HttpError } from "../errors/http-error.js";
import {
  contactSubmissionToJson,
  propertyInquiryToJson,
} from "../utils/serialization.js";
import { assertTurnstileIfRequired } from "../utils/form-security.js";
import * as emailService from "../services/email.service.js";
import { isFormNotificationEnabled, logSmtpErrorSafe } from "../services/mailer.js";

export async function submitContact(req: Request, res: Response): Promise<void> {
  const parsed = contactPublicSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Données invalides.", {
      details: parsed.error.flatten(),
      code: "VALIDATION_ERROR",
    });
  }
  const { turnstileToken, ...fields } = parsed.data;
  await assertTurnstileIfRequired(turnstileToken, req);

  const row = await inquiryService.createContactSubmission(fields);

  if (isFormNotificationEnabled()) {
    try {
      await emailService.notifyNewContactForm(row.id, fields);
    } catch (e) {
      logSmtpErrorSafe(e, "contact_form");
      res.status(503).json({
        ok: false,
        error: "EMAIL_SEND_FAILED",
        message: "Email could not be sent",
        id: row.id,
      });
      return;
    }
  }

  res.status(201).json({ ok: true, id: row.id, submission: contactSubmissionToJson(row) });
}

export async function submitPropertyInquiry(req: Request, res: Response): Promise<void> {
  const parsed = propertyInquiryPublicSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Données invalides.", {
      details: parsed.error.flatten(),
      code: "VALIDATION_ERROR",
    });
  }
  const { turnstileToken, ...fields } = parsed.data;
  await assertTurnstileIfRequired(turnstileToken, req);

  const row = await inquiryService.createPropertyInquiry({
    propertyId: fields.propertyId,
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    message: fields.message,
    preferredDate: fields.preferredDate,
  });

  if (isFormNotificationEnabled()) {
    try {
      await emailService.notifyNewPropertyInquiry(row.id, {
        propertyId: fields.propertyId,
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        message: fields.message,
        preferredDate: fields.preferredDate,
      });
    } catch (e) {
      logSmtpErrorSafe(e, "property_inquiry");
      res.status(503).json({
        ok: false,
        error: "EMAIL_SEND_FAILED",
        message: "Email could not be sent",
        id: row.id,
      });
      return;
    }
  }

  res.status(201).json({ ok: true, id: row.id, inquiry: propertyInquiryToJson(row) });
}
