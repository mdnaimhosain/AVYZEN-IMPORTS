import { Order } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { sendOrderWhatsAppNotification } from "@/services/whatsapp";
import { sendOrderConfirmationEmail } from "@/services/email";

/**
 * Dispatch instant order notification to owner's Telegram channel or bot chat
 * 100% Free, no credit card or business verification required.
 * Setup: Create a bot with @BotFather on Telegram, paste TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env
 */
export async function sendOrderTelegramNotification(order: Order): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return false;
  }

  try {
    const itemsText = order.items && order.items.length > 0
      ? order.items
          .map(
            (item, idx) =>
              `${idx + 1}. *${item.product_name}*${item.variant_name ? ` (${item.variant_name})` : ""} × ${item.quantity} = ${formatPrice(item.total_price)}`
          )
          .join("\n")
      : "No items";

    const message = `🛍️ *NEW ORDER RECEIVED — AVYZEN IMPORTS*
━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${order.order_number}
💰 *Total Payable:* *${formatPrice(order.total)}* (${order.payment_method})
💳 *Payment Status:* ${order.payment_status}

👤 *Customer Details:*
• Name: *${order.customer_name}*
• Phone: \`${order.customer_phone}\`
• Email: ${order.customer_email || "N/A"}

📍 *Delivery Address:*
${order.address}, ${order.area}, ${order.city}${order.postal_code ? ` - ${order.postal_code}` : ""}
${order.delivery_notes ? `📝 *Notes:* "${order.delivery_notes}"\n` : ""}
📦 *Ordered Products:*
${itemsText}
━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *Avyzen Operations Portal*`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("[Telegram Notification Error]:", err);
    return false;
  }
}

/**
 * High-reliability multi-channel notification dispatcher
 */
export async function dispatchAllOrderNotifications(order: Order) {
  const results = await Promise.allSettled([
    sendOrderTelegramNotification(order),
    sendOrderWhatsAppNotification(order),
    sendOrderConfirmationEmail(order),
  ]);

  return results;
}
