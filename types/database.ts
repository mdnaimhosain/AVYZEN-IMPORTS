export type OrderStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod = "COD" | "ONLINE";

export type UserRole = "CUSTOMER" | "ADMIN";

export type CouponType = "PERCENTAGE" | "FIXED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  options: Record<string, string>; // e.g. { "Color": "Midnight Black", "Size": "256GB" }
  image_url: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  created_at: string;
  updated_at: string;
  // Related data
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  rating?: number;
  review_count?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url?: string | null;
}

export interface Order {
  id: string;
  order_number: string; // e.g. ORD-2026-000001
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  city: string;
  area: string;
  postal_code: string | null;
  delivery_notes: string | null;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  coupon_code?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string; // "COD" | "SSLCOMMERZ" | "BKASH" | "STRIPE"
  transaction_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  raw_reference_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string | null;
  customer_name: string;
  rating: number;
  review: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minimum_order: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}
