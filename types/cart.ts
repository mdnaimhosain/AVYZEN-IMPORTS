import { Product, ProductVariant } from "./database";

export interface CartItem {
  id: string; // Composite unique key: `${productId}-${variantId || 'standard'}`
  productId: string;
  variantId?: string | null;
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  unitPrice: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string | null;
}
