import "server-only";
import { siteConfig } from "@/config/site";
import {
  buildInvoiceEmailHtml,
  buildInvoiceEmailText,
} from "@/lib/invoice/build-invoice";
import type { InvoiceOrder } from "@/lib/invoice/types";
import { sendMail, type MailResult } from "./smtp";

export async function sendOrderInvoiceEmail(order: InvoiceOrder): Promise<MailResult> {
  const subject = `${siteConfig.name} invoice ${order.number} · order confirmed`;
  return sendMail({
    to: order.email,
    subject,
    text: buildInvoiceEmailText(order),
    html: buildInvoiceEmailHtml(order),
    replyTo: siteConfig.email,
  });
}
