import { Order } from "@/types/database";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

// Official Meta WhatsApp Business Cloud API Endpoint
const GRAPH_API_VERSION = "v19.0";

export function generateCustomerSupportUrl(customMessage?: string): string {
  const message = customMessage || `Hello ${siteConfig.name}, I would like to inquire about your products and services.`;
  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function generateProductInquiryUrl(productName: string, productUrl: string): string {
  const message = `Hello ${siteConfig.name}, I am interested in:
Product: ${productName}
Product URL: ${productUrl}

Please let me know if this item is currently in stock.`;
  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function generateOrderWhatsAppUrl(order: Order): string {
  const itemsText = order.items
    ? order.items
        .map(
          (item) =>
            `- ${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ""} × ${item.quantity} = ${formatPrice(item.total_price)}`
        )
        .join("\n")
    : "Items in order";

  const message = `*NEW ORDER CONFIRMATION*
*Order ID:* ${order.order_number}

*Customer Details:*
• Name: ${order.customer_name}
• Phone: ${order.customer_phone}
• Email: ${order.customer_email}

*Order Items:*
${itemsText}

*Financial Summary:*
• Subtotal: ${formatPrice(order.subtotal)}
• Shipping: ${formatPrice(order.shipping_fee)}
• Discount: ${formatPrice(order.discount)}
• *Total:* ${formatPrice(order.total)}
• Payment Method: ${order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}
• Payment Status: ${order.payment_status}

*Delivery Address:*
${order.address}, ${order.area}, ${order.city}${order.postal_code ? ` - ${order.postal_code}` : ""}
${order.delivery_notes ? `*Delivery Notes:* ${order.delivery_notes}` : ""}`;

  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Official Server-Side Meta WhatsApp Business Cloud API Integration
 * Decoupled & Resilient: Failures are logged and handled without throwing errors.
 */
export async function sendOrderWhatsAppNotification(order: Order): Promise<{
  success: boolean;
  sentToAdmin?: boolean;
  sentToCustomer?: boolean;
  error?: string;
}> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const adminWhatsAppNumber = process.env.ADMIN_WHATSAPP_NOTIFICATION_NUMBER || siteConfig.business.whatsappNumber;

  // If credentials are not set in environment, log for operator and gracefully return
  if (!phoneNumberId || !accessToken) {
    console.info(
      `[WhatsApp Cloud API]: Credentials not set in environment. Notification skipped for ${order.order_number}. Order remains confirmed.`
    );
    return {
      success: true,
      error: "WhatsApp Cloud API credentials not configured in environment.",
    };
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  const orderMessage = `*NEW ORDER RECEIVED — AVYZEN IMPORTS*
Order Number: ${order.order_number}
Total Amount: ${formatPrice(order.total)} (${order.payment_status})
Customer: ${order.customer_name} (${order.customer_phone})
Address: ${order.address}, ${order.city}`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: adminWhatsAppNumber,
    type: "text",
    text: { preview_url: false, body: orderMessage },
  };

  // Implement resilient retry mechanism with backoff
  let attempt = 0;
  const maxAttempts = 3;
  let sentSuccessfully = false;

  while (attempt < maxAttempts && !sentSuccessfully) {
    attempt++;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        sentSuccessfully = true;
        console.info(`[WhatsApp Cloud API]: Notification sent successfully for order ${order.order_number}`);
      } else {
        const errorText = await response.text();
        console.warn(`[WhatsApp Cloud API]: Attempt ${attempt} failed with status ${response.status}: ${errorText}`);
        if (attempt < maxAttempts) {
          await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
        }
      }
    } catch (networkError) {
      console.error(`[WhatsApp Cloud API]: Network exception on attempt ${attempt}:`, networkError);
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  return {
    success: sentSuccessfully,
    sentToAdmin: sentSuccessfully,
  };
}
