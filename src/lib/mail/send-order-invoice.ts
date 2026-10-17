import "server-only";
import { siteConfig } from "@/config/site";
import {
  buildInvoiceEmailHtml,
  buildInvoiceEmailText,
} from "@/lib/invoice/build-invoice";
import type { InvoiceOrder } from "@/lib/invoice/types";
import { sendMail, type MailResult } from "./smtp";

export async function sendOrderInvoiceEmail(order: InvoiceOrder): Promise<MailResult> {
  if (!order.email?.trim()) {
    return { ok: false, error: "Order has no customer email address." };
  }

  const subject = `${siteConfig.name} invoice ${order.number} — order confirmed`;
  return sendMail({
    to: order.email.trim(),
    subject,
    text: buildInvoiceEmailText(order),
    html: buildInvoiceEmailHtml(order),
    replyTo: process.env.SMTP_REPLY_TO?.trim() || siteConfig.email,
  });
}
