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

/**
 * Direct 1-Click WhatsApp Order for a specific product and variant
 */
export function generateDirectProductOrderUrl(params: {
  productName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productUrl: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
}): string {
  const cleanAddress = params.customerAddress?.trim();
  if (!cleanAddress || cleanAddress.length < 5) {
    throw new Error("Valid delivery address is strictly required to place an order.");
  }
  const cleanName = params.customerName?.trim();
  const cleanPhone = params.customerPhone?.trim();
  if (!cleanName || !cleanPhone) {
    throw new Error("Customer name and phone number are required to place an order.");
  }

  const variantDisplay = params.variantName ? params.variantName : "Standard Edition";
  const cityDisplay = params.customerCity ? `, ${params.customerCity}` : "";
  const message = `🛍️ *NEW PRODUCT ORDER — AVYZEN IMPORTS*
Hello Avyzen Imports! I want to order this product:

📦 *ORDERED PRODUCT:*
• Product: *${params.productName}*
• Edition/Variant: ${variantDisplay}
• Quantity: ${params.quantity}
• Unit Price: ${formatPrice(params.unitPrice)}
• *Total Payable:* *${formatPrice(params.totalPrice)}*
• Product Link: ${params.productUrl}

👤 *CUSTOMER & DELIVERY INFORMATION:*
• Name: ${cleanName}
• Mobile Phone: ${cleanPhone}
• Delivery Address: ${cleanAddress}${cityDisplay}
• Payment Method: Cash on Delivery (ক্যাশ অন ডেলিভারি)

Please confirm my order and let me know the delivery timeline. Thank you!`;

  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Cart WhatsApp Order for multiple items
 */
export function generateCartWhatsAppOrderUrl(params: {
  items: Array<{
    name: string;
    variantName?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingFee?: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
}): string {
  const cleanAddress = params.customerAddress?.trim();
  if (!cleanAddress || cleanAddress.length < 5) {
    throw new Error("Valid delivery address is strictly required to place an order.");
  }
  const cleanName = params.customerName?.trim();
  const cleanPhone = params.customerPhone?.trim();
  if (!cleanName || !cleanPhone) {
    throw new Error("Customer name and phone number are required to place an order.");
  }

  const itemsText = params.items
    .map(
      (item, idx) =>
        `${idx + 1}️⃣ *${item.name}*${item.variantName ? ` (Edition: ${item.variantName})` : ""}\n   • Qty: ${item.quantity} × ${formatPrice(item.unitPrice)} = *${formatPrice(item.totalPrice)}*`
    )
    .join("\n\n");

  const cityDisplay = params.customerCity ? `, ${params.customerCity}` : "";

  const message = `🛍️ *NEW CART ORDER — AVYZEN IMPORTS*
Hello Avyzen Imports! I want to order the following items:

📦 *ORDERED PRODUCTS:*
${itemsText}

💰 *PAYMENT BREAKDOWN:*
• Subtotal: ${formatPrice(params.subtotal)}
• Delivery Fee: ${params.shippingFee !== undefined && params.shippingFee === 0 ? "FREE" : params.shippingFee ? formatPrice(params.shippingFee) : "Standard"}
• *Total Payable:* *${formatPrice(params.total)}*

👤 *DELIVERY INFORMATION:*
• Name: ${cleanName}
• Mobile Phone: ${cleanPhone}
• Full Address: ${cleanAddress}${cityDisplay}
• Payment Method: Cash on Delivery (ক্যাশ অন ডেলিভারি)

Please confirm stock and arrange delivery to my address. Thank you!`;

  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Confirmed Order WhatsApp URL (Generated after checkout submission)
 */
export function generateOrderWhatsAppUrl(order: Order): string {
  const itemsText = order.items && order.items.length > 0
    ? order.items
        .map(
          (item, idx) =>
            `${idx + 1}️⃣ *${item.product_name}*${item.variant_name ? ` (Edition: ${item.variant_name})` : ""}\n   • Qty: ${item.quantity} × ${formatPrice(item.unit_price)} = *${formatPrice(item.total_price)}*`
        )
        .join("\n\n")
    : "Items in order";

  const message = `🛍️ *CONFIRMED ORDER NOTIFICATION — AVYZEN IMPORTS*
━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${order.order_number}
📅 *Date:* ${new Date(order.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short" })}

📦 *ORDERED PRODUCTS:*
${itemsText}

💰 *FINANCIAL SUMMARY:*
• Subtotal: ${formatPrice(order.subtotal)}
• Delivery Charge: ${order.shipping_fee === 0 ? "FREE (৳0)" : formatPrice(order.shipping_fee)}
${order.discount > 0 ? `• Discount (${order.coupon_code || "Promo"}): -${formatPrice(order.discount)}\n` : ""}• *TOTAL PAYABLE:* *${formatPrice(order.total)}*
• Payment Method: ${order.payment_method === "COD" ? "Cash on Delivery (ক্যাশ অন ডেলিভারি)" : "Online Payment Gateway"}
• Payment Status: ${order.payment_status}

👤 *CUSTOMER & DELIVERY ADDRESS:*
• Name: ${order.customer_name}
• Mobile Phone: ${order.customer_phone}
• Email: ${order.customer_email}
• Full Address: ${order.address}
• Area / Thana: ${order.area}
• City / District: ${order.city}${order.postal_code ? ` (Postal: ${order.postal_code})` : ""}
${order.delivery_notes ? `• Delivery Notes: "${order.delivery_notes}"\n` : ""}━━━━━━━━━━━━━━━━━━━━━━━━
Hello Avyzen Imports! I have placed this order on your website. Please confirm availability and prepare it for delivery. Thank you!`;

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

  const itemsList = order.items && order.items.length > 0
    ? order.items
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ""} × ${item.quantity} = ${formatPrice(item.total_price)}`
        )
        .join("\n")
    : "No items";

  const orderMessage = `*NEW ORDER RECEIVED — AVYZEN IMPORTS*
Order Number: #${order.order_number}
Total: ${formatPrice(order.total)} (${order.payment_method} - ${order.payment_status})

Products:
${itemsList}

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

/**
 * Clean & format any phone number to a valid WhatsApp international format (e.g. 8801XXXXXXXXX)
 */
export function formatWhatsAppPhoneNumber(phone: string): string {
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "88" + clean;
  } else if (!clean.startsWith("88") && clean.length === 10) {
    clean = "880" + clean;
  }
  return clean;
}

export type AdminWhatsAppTemplate =
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "PAYMENT_RECEIVED"
  | "CANCELLED"
  | "GENERAL";

/**
 * Generate predefined localized WhatsApp notification messages for admin to send to customers
 */
export function getAdminWhatsAppTemplateMessage(order: Order, template: AdminWhatsAppTemplate): string {
  const itemsSummary = order.items && order.items.length > 0
    ? order.items
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ""} × ${item.quantity} = ${formatPrice(item.total_price)}`
        )
        .join("\n")
    : "অর্ডারের আইটেমসমূহ";

  switch (template) {
    case "CONFIRMED":
      return `🛍️ *অর্ডার কনফার্মেশন — AVYZEN IMPORTS*
আসসালামু আলাইকুম ${order.customer_name},
Avyzen Imports থেকে আপনার অর্ডার #${order.order_number} সফলভাবে কনফার্ম করা হয়েছে।

📦 *পণ্য তালিকা:*
${itemsSummary}

💰 *মোট প্রদেয়:* ${formatPrice(order.total)} (${order.payment_method === "COD" ? "ক্যাশ অন ডেলিভারি" : "অনলাইন পেমেন্ট"})
📍 *ডেলিভারি ঠিকানা:* ${order.address}, ${order.area}, ${order.city}

পণ্যটি দ্রুত প্যাকেজিং সম্পন্ন করে কুরিয়ারে হস্তান্তর করা হবে।
ধন্যবাদ, Avyzen Imports
📞 হেল্পলাইন: +8801939846312`;

    case "SHIPPED":
      return `🚚 *অর্ডার শিপমেন্ট আপডেট — AVYZEN IMPORTS*
আসসালামু আলাইকুম ${order.customer_name},
আপনার অর্ডার #${order.order_number} ডেলিভারির উদ্দেশ্যে পাঠানো হয়েছে!

📦 *অর্ডার:* #${order.order_number}
📍 *ডেলিভারি ঠিকানা:* ${order.address}, ${order.area}, ${order.city}
💰 *পরিশোধযোগ্য টাকা:* ${order.payment_method === "COD" && order.payment_status !== "PAID" ? formatPrice(order.total) : "পরিশোধিত (PAID)"}

অনুগ্রহ করে ডেলিভারি রাইডারের ফোন রিসিভ করার জন্য প্রস্তুত থাকুন।
ধন্যবাদ, Avyzen Imports!
📞 হেল্পলাইন: +8801939846312`;

    case "DELIVERED":
      return `✅ *ডেলিভারি সম্পন্ন — AVYZEN IMPORTS*
আসসালামু আলাইকুম ${order.customer_name},
আপনার অর্ডার #${order.order_number} সফলভাবে ডেলিভারি সম্পন্ন হয়েছে।

Avyzen Imports-এর সাথে কেনাকাটা করার জন্য আন্তরিক ধন্যবাদ! পণ্যটি কেমন লেগেছে অনুগ্রহ করে আমাদের জানাবেন।
যেকোনো সহায়তায় আমাদের জানান।
🌐 avyzenimports.com
📞 হেল্পলাইন: +8801939846312`;

    case "PAYMENT_RECEIVED":
      return `💳 *পেমেন্ট প্রাপ্তি নিশ্চিতকরণ — AVYZEN IMPORTS*
আসসালামু আলাইকুম ${order.customer_name},
আপনার অর্ডার #${order.order_number}-এর জন্য ${formatPrice(order.total)} পেমেন্ট সফলভাবে গৃহীত হয়েছে।

পেমেন্ট স্ট্যাটাস: পরিশোধিত (PAID)
অর্ডারটি দ্রুততম সময়ে প্রসেসিং করে পাঠানো হবে।
ধন্যবাদ, Avyzen Imports
📞 হেল্পলাইন: +8801939846312`;

    case "CANCELLED":
      return `⚠️ *অর্ডার বাতিল সংক্রান্ত নোটিফিকেশন — AVYZEN IMPORTS*
আসসালামু আলাইকুম ${order.customer_name},
আপনার অর্ডার #${order.order_number} অনাকাঙ্ক্ষিত কারণে বাতিল করা হয়েছে।

বিস্তারিত জানতে অনুগ্রহ করে আমাদের হেল্পলাইনে যোগাযোগ করুন:
📞 হেল্পলাইন: +8801939846312
ধন্যবাদ, Avyzen Imports`;

    case "GENERAL":
    default:
      return `Hello ${order.customer_name}, this is Avyzen Imports regarding your Order #${order.order_number}. Current status: ${order.order_status}.
How can we assist you today?
Website: https://avyzenimports.com
Helpline: +8801939846312`;
  }
}

/**
 * Generate WhatsApp URL directly to the customer's phone with a custom message
 */
export function generateAdminToCustomerWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppPhoneNumber(phone);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

