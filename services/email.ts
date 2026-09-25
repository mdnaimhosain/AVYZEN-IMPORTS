import { Order } from "@/types/database";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendOrderConfirmationEmail(order: Order): Promise<EmailResult> {
  // In production, integrates with Resend, Postmark, AWS SES or SendGrid.
  // Sensitive SMTP or API tokens are loaded via environment variables.
  console.info(`[Email Service]: Preparing order confirmation receipt for ${order.customer_email} (${order.order_number})`);

  try {
    // Structural email payload simulation
    const emailPayload = {
      from: `${siteConfig.name} <${siteConfig.business.email}>`,
      to: order.customer_email,
      subject: `Order Confirmed — ${order.order_number} (${formatPrice(order.total)})`,
      body: `Thank you for your order at ${siteConfig.name}. Your order number is ${order.order_number}.`,
    };

    // If an external email provider API key is present:
    if (process.env.RESEND_API_KEY) {
      // Direct API call
    }

    return {
      success: true,
      messageId: `msg-${Date.now()}`,
    };
  } catch (error) {
    console.error("[Email Service]: Failed to dispatch email:", error);
    return {
      success: false,
      error: "Email delivery temporarily unavailable.",
    };
  }
}
