import { z } from "zod";

// Bangladeshi phone regex: supports 017..., +88017..., 88017...
const bdPhoneRegex = /^(?:\+?880|0)?1[3-9]\d{8}$/;

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),
  phone: z
    .string()
    .regex(bdPhoneRegex, "Please enter a valid Bangladesh phone number (e.g. 017XXXXXXXX)"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  address: z
    .string()
    .min(5, "Please provide complete delivery street address")
    .max(250, "Address is too long")
    .trim(),
  city: z
    .string()
    .min(2, "Please select or enter your city/district")
    .trim(),
  area: z
    .string()
    .min(2, "Please enter your area/thana")
    .trim(),
  postalCode: z
    .string()
    .max(10, "Postal code too long")
    .optional()
    .or(z.literal("")),
  deliveryNotes: z
    .string()
    .max(500, "Delivery notes cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(["COD", "ONLINE"], {
    error: "Please select a payment method",
  }),
  couponCode: z.string().optional().or(z.literal("")),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const createOrderServerSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(bdPhoneRegex),
  customerEmail: z.string().email(),
  address: z.string().min(5).max(250),
  city: z.string().min(2),
  area: z.string().min(2),
  postalCode: z.string().optional().nullable(),
  deliveryNotes: z.string().optional().nullable(),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  couponCode: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional().nullable(),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one item"),
});

export type CreateOrderServerInput = z.infer<typeof createOrderServerSchema>;

export const orderTrackingSchema = z.object({
  orderNumber: z
    .string()
    .min(3, "Please enter a valid order number")
    .trim(),
  phone: z
    .string()
    .min(6, "Please enter the phone number used during checkout")
    .trim(),
});

export type OrderTrackingInput = z.infer<typeof orderTrackingSchema>;

export const couponValidationSchema = z.object({
  code: z.string().min(1, "Coupon code is required").trim().toUpperCase(),
  subtotal: z.number().min(0, "Subtotal must be positive"),
});

export const productAdminSchema = z.object({
  name: z.string().min(2).max(200),
  categoryId: z.string().min(1),
  sku: z.string().min(2).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  imageUrl: z
    .string()
    .refine(
      (val) => !val || val === "" || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
      { message: "Must be a valid web URL (https://...) or local image path (/images/...)" }
    )
    .optional()
    .nullable(),
});

export type ProductAdminInput = z.infer<typeof productAdminSchema>;

export const paymentWebhookSchema = z.object({
  provider: z.string(),
  orderId: z.string(),
  transactionId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("BDT"),
  status: z.enum(["PAID", "FAILED", "CANCELLED"]),
  signature: z.string().optional(),
  rawPayload: z.record(z.string(), z.unknown()).optional(),
});
