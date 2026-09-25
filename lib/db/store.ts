import { Category, Product, ProductVariant, Order, OrderItem, Coupon, Payment, Review } from "@/types/database";
import { generateOrderNumber } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// Initial seed categories
const initialCategories: Category[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    name: "Audio & Sound",
    slug: "audio",
    description: "High fidelity headphones, earbuds, and premium sound systems.",
    image: "/images/categories/audio.jpg",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    name: "Electronics",
    slug: "electronics",
    description: "Cutting-edge consumer gadgets, GaN chargers, and power hubs.",
    image: "/images/categories/electronics.jpg",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    name: "Smart Gadgets",
    slug: "smart-gadgets",
    description: "Productivity gear, smart workspace setups, and wearable tech.",
    image: "/images/categories/smart-gadgets.jpg",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000004",
    name: "Lifestyle & Luxury",
    slug: "lifestyle",
    description: "Precision chronograph watches, leather accessories, and luxury EDC.",
    image: "/images/categories/lifestyle.jpg",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial seed products with variants and images
const initialProducts: Product[] = [
  {
    id: "p1000000-0000-0000-0000-000000000001",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Avyzen Apex Pro Wireless ANC Headphones",
    slug: "avyzen-apex-pro-wireless-anc-headphones",
    sku: "AV-APEX-01",
    description: "Engineered for acoustic purists. Features dual 40mm beryllium drivers, active hybrid noise cancellation up to 45dB, 50-hour battery life, and ultra-plush memory foam earcups for all-day luxury comfort.",
    price: 8499,
    compare_at_price: 10500,
    stock: 45,
    is_active: true,
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "i1",
        product_id: "p1000000-0000-0000-0000-000000000001",
        image_url: "/images/products/apex-pro.jpg",
        alt_text: "Avyzen Apex Pro Midnight Black",
        sort_order: 0,
      },
    ],
    variants: [
      {
        id: "v1000000-0000-0000-0000-000000000001",
        product_id: "p1000000-0000-0000-0000-000000000001",
        name: "Matte Obsidian Black",
        sku: "AV-APEX-BLK",
        price: 8499,
        stock: 25,
        options: { Color: "Matte Obsidian Black" },
        image_url: "/images/products/apex-pro.jpg",
      },
      {
        id: "v1000000-0000-0000-0000-000000000002",
        product_id: "p1000000-0000-0000-0000-000000000001",
        name: "Silver Frost White",
        sku: "AV-APEX-SLV",
        price: 8499,
        stock: 20,
        options: { Color: "Silver Frost White" },
        image_url: "/images/products/apex-pro.jpg",
      },
    ],
  },
  {
    id: "p1000000-0000-0000-0000-000000000002",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Avyzen Nova 65W GaN III Fast Charger",
    slug: "avyzen-nova-65w-gan-iii-fast-charger",
    sku: "AV-NOVA-65",
    description: "Ultra-compact Gallium Nitride (GaN III) high-speed charging brick. Dual USB-C and single USB-A ports supporting PD 3.0, QC 4+, and PPS for MacBook, iPhone, Samsung, and laptops.",
    price: 2450,
    compare_at_price: 3200,
    stock: 80,
    is_active: true,
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "i3",
        product_id: "p1000000-0000-0000-0000-000000000002",
        image_url: "/images/products/nova-gan.jpg",
        alt_text: "Avyzen Nova 65W GaN Charger",
        sort_order: 0,
      },
    ],
  },
  {
    id: "p1000000-0000-0000-0000-000000000003",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Avyzen K75 Pro Hot-Swap Mechanical Keyboard",
    slug: "avyzen-k75-pro-hot-swap-mechanical-keyboard",
    sku: "AV-K75-RGB",
    description: "75% compact layout with CNC aerospace aluminum chassis, gasket mount design, pre-lubed linear switches, tri-mode wireless connectivity (Bluetooth 5.1/2.4G/USB-C), and customizable South-facing RGB lighting.",
    price: 6890,
    compare_at_price: 8200,
    stock: 30,
    is_active: true,
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 5.0,
    review_count: 31,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "i4",
        product_id: "p1000000-0000-0000-0000-000000000003",
        image_url: "/images/products/k75-keyboard.jpg",
        alt_text: "Avyzen K75 Mechanical Keyboard Top",
        sort_order: 0,
      },
    ],
    variants: [
      {
        id: "v1000000-0000-0000-0000-000000000003",
        product_id: "p1000000-0000-0000-0000-000000000003",
        name: "Cream White / Red Switches",
        sku: "AV-K75-RED",
        price: 6890,
        stock: 15,
        options: { Color: "Cream White", Switch: "Red Linear" },
        image_url: null,
      },
      {
        id: "v1000000-0000-0000-0000-000000000004",
        product_id: "p1000000-0000-0000-0000-000000000003",
        name: "Smoky Gray / Brown Switches",
        sku: "AV-K75-BRN",
        price: 6890,
        stock: 15,
        options: { Color: "Smoky Gray", Switch: "Brown Tactile" },
        image_url: null,
      },
    ],
  },
  {
    id: "p1000000-0000-0000-0000-000000000004",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Avyzen Chrono Royal Sapphire Leather Watch",
    slug: "avyzen-chrono-royal-sapphire-leather-watch",
    sku: "AV-CHRONO-01",
    description: "Handcrafted elegance with Japanese Miyota quartz movement, scratch-resistant sapphire crystal glass, 5ATM water resistance, and genuine Italian full-grain leather strap.",
    price: 5990,
    compare_at_price: 7500,
    stock: 25,
    is_active: true,
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "i5",
        product_id: "p1000000-0000-0000-0000-000000000004",
        image_url: "/images/products/chrono-watch.jpg",
        alt_text: "Avyzen Chrono Royal Watch",
        sort_order: 0,
      },
    ],
    variants: [
      {
        id: "v1000000-0000-0000-0000-000000000005",
        product_id: "p1000000-0000-0000-0000-000000000004",
        name: "Cognac Tan Brown Leather",
        sku: "AV-CHRONO-BRN",
        price: 5990,
        stock: 15,
        options: { Strap: "Cognac Tan Leather" },
        image_url: null,
      },
      {
        id: "v1000000-0000-0000-0000-000000000006",
        product_id: "p1000000-0000-0000-0000-000000000004",
        name: "Classic Midnight Black Leather",
        sku: "AV-CHRONO-BLK",
        price: 5990,
        stock: 10,
        options: { Strap: "Midnight Black Leather" },
        image_url: null,
      },
    ],
  },
  {
    id: "p1000000-0000-0000-0000-000000000005",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Avyzen ErgoStand Pro 360 Rotating Laptop Stand",
    slug: "avyzen-ergostand-pro-360-laptop-stand",
    sku: "AV-ERGO-360",
    description: "Precision engineered sandblasted aluminum stand with a silent 360-degree rotating base, dual-hinge elevation up to 30cm, and silicone non-slip heat dissipation pads.",
    price: 2850,
    compare_at_price: 3500,
    stock: 55,
    is_active: true,
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "i6",
        product_id: "p1000000-0000-0000-0000-000000000005",
        image_url: "/images/categories/smart-gadgets.jpg",
        alt_text: "Avyzen ErgoStand Pro Laptop Stand",
        sort_order: 0,
      },
    ],
  },
  {
    id: "p1000000-0000-0000-0000-000000000006",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Avyzen MagPower Slim 10,000mAh Magnetic Power Bank",
    slug: "avyzen-magpower-slim-10000mah",
    sku: "AV-MAG-10K",
    description: "Snap and charge on the go with strong 15W wireless MagSafe alignment, 20W PD Type-C fast bi-directional charging, and a discreet fold-out kickstand.",
    price: 3190,
    compare_at_price: 3990,
    stock: 60,
    is_active: true,
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "i7",
        product_id: "p1000000-0000-0000-0000-000000000006",
        image_url: "/images/categories/electronics.jpg",
        alt_text: "Avyzen MagPower Wireless Power Bank",
        sort_order: 0,
      },
    ],
  },
];

// Initial seed coupons
const initialCoupons: Coupon[] = [
  {
    id: "cp1",
    code: "AVYZEN10",
    type: "PERCENTAGE",
    value: 10,
    minimum_order: 2000,
    max_discount: 1000,
    usage_limit: 500,
    used_count: 14,
    starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    is_active: true,
  },
  {
    id: "cp2",
    code: "WELCOME200",
    type: "FIXED",
    value: 200,
    minimum_order: 1500,
    max_discount: 200,
    usage_limit: 1000,
    used_count: 48,
    starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    is_active: true,
  },
];

// Global in-memory transactional database store (persists across requests during server runtime)
declare global {
  // eslint-disable-next-line no-var
  var __avyzen_store__: {
    categories: Category[];
    products: Product[];
    orders: Order[];
    coupons: Coupon[];
    payments: Payment[];
    reviews: Review[];
  } | undefined;
}

if (!global.__avyzen_store__) {
  global.__avyzen_store__ = {
    categories: initialCategories,
    products: initialProducts,
    orders: [
      {
        id: "ord-seed-01",
        order_number: "ORD-2026-981240",
        customer_id: null,
        customer_name: "Mahmudul Islam",
        customer_phone: "01712345678",
        customer_email: "mahmudul@example.com",
        address: "House 18, Road 4, Sector 7, Uttara",
        city: "Dhaka",
        area: "Uttara",
        postal_code: "1230",
        delivery_notes: "Please call before arrival.",
        subtotal: 8499,
        discount: 200,
        shipping_fee: 70,
        total: 8369,
        payment_method: "ONLINE",
        payment_status: "PAID",
        order_status: "PROCESSING",
        coupon_code: "WELCOME200",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          {
            id: "item-seed-01",
            order_id: "ord-seed-01",
            product_id: "p1000000-0000-0000-0000-000000000001",
            variant_id: "v1000000-0000-0000-0000-000000000001",
            product_name: "Avyzen Apex Pro Wireless ANC Headphones",
            variant_name: "Matte Obsidian Black",
            quantity: 1,
            unit_price: 8499,
            total_price: 8499,
            image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
    ],
    coupons: initialCoupons,
    payments: [
      {
        id: "pay-seed-01",
        order_id: "ord-seed-01",
        provider: "ONLINE_GATEWAY",
        transaction_id: "TRX-AVZ-981240",
        amount: 8369,
        currency: "BDT",
        status: "PAID",
        raw_reference_id: "GW-REF-772183",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    reviews: [
      {
        id: "r1",
        product_id: "p1000000-0000-0000-0000-000000000001",
        customer_id: null,
        customer_name: "Tanvir Ahmed",
        rating: 5,
        review: "Exceptional sound separation and active noise cancellation. Received original package in Dhaka in under 24 hours. Avyzen is genuine!",
        status: "APPROVED",
        created_at: new Date().toISOString(),
      },
    ],
  };
}

const store = global.__avyzen_store__;

// Helper to attach category data to product
function attachCategory(product: Product): Product {
  const cat = store.categories.find((c) => c.id === product.category_id);
  return { ...product, category: cat };
}

export async function getCategories(): Promise<Category[]> {
  return store.categories.filter((c) => c.is_active);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return store.categories.find((c) => c.slug === slug && c.is_active) || null;
}

export interface ProductFilters {
  categorySlug?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let list = store.products.filter((p) => p.is_active);

  if (filters?.categorySlug) {
    const cat = store.categories.find((c) => c.slug === filters.categorySlug);
    if (cat) {
      list = list.filter((p) => p.category_id === cat.id);
    }
  }

  if (filters?.featured) {
    list = list.filter((p) => p.is_featured);
  }

  if (filters?.bestSeller) {
    list = list.filter((p) => p.is_best_seller);
  }

  if (filters?.newArrival) {
    list = list.filter((p) => p.is_new_arrival);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  if (filters?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters?.inStock) {
    list = list.filter((p) => p.stock > 0);
  }

  // Sorting
  if (filters?.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (filters?.sort === "newest") {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (filters?.sort === "rating") {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return list.map(attachCategory);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = store.products.find((p) => p.slug === slug && p.is_active);
  if (!product) return null;
  return attachCategory(product);
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = store.products.find((p) => p.id === id);
  if (!product) return null;
  return attachCategory(product);
}

export async function getVariantById(productId: string, variantId: string): Promise<ProductVariant | null> {
  const product = store.products.find((p) => p.id === productId);
  if (!product || !product.variants) return null;
  return product.variants.find((v) => v.id === variantId) || null;
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message: string }> {
  const coupon = store.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active);
  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid promo coupon code." };
  }

  const now = new Date();
  if (now > new Date(coupon.expires_at)) {
    return { valid: false, discount: 0, message: "This coupon code has expired." };
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, discount: 0, message: "Coupon usage limit has been reached." };
  }

  if (subtotal < coupon.minimum_order) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ৳${coupon.minimum_order} required for this coupon.`,
    };
  }

  let discount = 0;
  if (coupon.type === "PERCENTAGE") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.value;
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon ${coupon.code} applied successfully!`,
  };
}

export interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  area: string;
  postalCode?: string | null;
  deliveryNotes?: string | null;
  paymentMethod: "COD" | "ONLINE";
  couponCode?: string | null;
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
  }>;
}

export async function createOrderSecure(params: CreateOrderParams): Promise<{ success: boolean; order?: Order; error?: string }> {
  // CRITICAL SERVER-SIDE CALCULATION:
  // Never trust price, discount or shipping from client!
  let subtotal = 0;
  const verifiedOrderItems: OrderItem[] = [];

  for (const itemInput of params.items) {
    const product = store.products.find((p) => p.id === itemInput.productId && p.is_active);
    if (!product) {
      return { success: false, error: `Product with ID ${itemInput.productId} is not available.` };
    }

    let unitPrice = product.price;
    let variantName: string | null = null;
    let availableStock = product.stock;

    if (itemInput.variantId) {
      const variant = product.variants?.find((v) => v.id === itemInput.variantId);
      if (!variant) {
        return { success: false, error: `Selected variant for "${product.name}" is no longer available.` };
      }
      unitPrice = variant.price;
      variantName = variant.name;
      availableStock = variant.stock;
    }

    if (availableStock < itemInput.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${product.name}${variantName ? ` - ${variantName}` : ""}". Only ${availableStock} remaining.`,
      };
    }

    const itemTotalPrice = unitPrice * itemInput.quantity;
    subtotal += itemTotalPrice;

    verifiedOrderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order_id: "", // Filled after order creation
      product_id: product.id,
      variant_id: itemInput.variantId || null,
      product_name: product.name,
      variant_name: variantName,
      quantity: itemInput.quantity,
      unit_price: unitPrice,
      total_price: itemTotalPrice,
      image_url: product.images?.[0]?.image_url || null,
    });
  }

  // Calculate discount server-side
  let discount = 0;
  if (params.couponCode) {
    const couponRes = await validateCoupon(params.couponCode, subtotal);
    if (couponRes.valid) {
      discount = couponRes.discount;
      // Increment coupon used count
      if (couponRes.coupon) {
        couponRes.coupon.used_count += 1;
      }
    }
  }

  // Calculate shipping fee server-side based on city/location
  const isInsideDhaka = params.city.toLowerCase().includes("dhaka") || params.area.toLowerCase().includes("dhaka");
  let shippingFee = isInsideDhaka ? siteConfig.shipping.insideDhaka.rate : siteConfig.shipping.outsideDhaka.rate;
  if (subtotal >= siteConfig.shipping.freeShippingThreshold) {
    shippingFee = 0;
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const orderNumber = generateOrderNumber();

  // Deduct inventory atomically
  for (const itemInput of params.items) {
    const product = store.products.find((p) => p.id === itemInput.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - itemInput.quantity);
      if (itemInput.variantId) {
        const variant = product.variants?.find((v) => v.id === itemInput.variantId);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - itemInput.quantity);
        }
      }
    }
  }

  // Payment and Order status separation
  const isOnline = params.paymentMethod === "ONLINE";
  const initialPaymentStatus = "UNPAID";
  const initialOrderStatus = isOnline ? "PAYMENT_PENDING" : "PENDING";

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: null,
    customer_name: params.customerName.trim(),
    customer_phone: params.customerPhone.trim(),
    customer_email: params.customerEmail.trim().toLowerCase(),
    address: params.address.trim(),
    city: params.city.trim(),
    area: params.area.trim(),
    postal_code: params.postalCode?.trim() || null,
    delivery_notes: params.deliveryNotes?.trim() || null,
    subtotal,
    discount,
    shipping_fee: shippingFee,
    total: grandTotal,
    payment_method: params.paymentMethod,
    payment_status: initialPaymentStatus,
    order_status: initialOrderStatus,
    coupon_code: params.couponCode || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: verifiedOrderItems.map((item) => ({ ...item, order_id: orderId })),
  };

  store.orders.unshift(newOrder);

  return { success: true, order: newOrder };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = store.orders.find((o) => o.id === id);
  if (!order) return null;
  const payment = store.payments.find((p) => p.order_id === order.id);
  return { ...order, payment: payment || null };
}

export async function getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<Order | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/\D/g, "");

  const order = store.orders.find((o) => {
    const oPhone = o.customer_phone.replace(/\D/g, "");
    return (
      o.order_number.toUpperCase() === cleanOrderNum &&
      (oPhone === cleanPhone || oPhone.endsWith(cleanPhone) || cleanPhone.endsWith(oPhone))
    );
  });

  if (!order) return null;
  const payment = store.payments.find((p) => p.order_id === order.id);
  return { ...order, payment: payment || null };
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: Order["order_status"],
  paymentStatus?: Order["payment_status"]
): Promise<Order | null> {
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.order_status = orderStatus;
  if (paymentStatus) {
    order.payment_status = paymentStatus;
  }
  order.updated_at = new Date().toISOString();
  return order;
}

export async function recordPayment(paymentData: {
  orderId: string;
  provider: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: Payment["status"];
  rawReferenceId?: string;
}): Promise<Payment> {
  const existingIndex = store.payments.findIndex((p) => p.order_id === paymentData.orderId);
  const payment: Payment = {
    id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    order_id: paymentData.orderId,
    provider: paymentData.provider,
    transaction_id: paymentData.transactionId,
    amount: paymentData.amount,
    currency: paymentData.currency,
    status: paymentData.status,
    raw_reference_id: paymentData.rawReferenceId || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    store.payments[existingIndex] = payment;
  } else {
    store.payments.push(payment);
  }

  // Update order's payment status
  const order = store.orders.find((o) => o.id === paymentData.orderId);
  if (order) {
    order.payment_status = paymentData.status;
    if (paymentData.status === "PAID") {
      order.order_status = "PAID";
    }
    order.updated_at = new Date().toISOString();
  }

  return payment;
}

export async function getAllOrders(filter?: { status?: string; search?: string }): Promise<Order[]> {
  let list = [...store.orders];

  if (filter?.status && filter.status !== "ALL") {
    list = list.filter((o) => o.order_status === filter.status);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.customer_email.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getAdminAnalytics() {
  const orders = store.orders;
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.payment_status === "PAID").length;
  const pendingOrders = orders.filter((o) => o.order_status === "PENDING" || o.order_status === "PAYMENT_PENDING").length;
  const deliveredOrders = orders.filter((o) => o.order_status === "DELIVERED").length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === "PAID")
    .reduce((sum, o) => sum + o.total, 0);

  const totalProducts = store.products.length;
  const lowStockProducts = store.products.filter((p) => p.stock < 10);

  return {
    totalRevenue,
    totalOrders,
    paidOrders,
    pendingOrders,
    deliveredOrders,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders: orders.slice(0, 5),
  };
}

export async function addProduct(data: Partial<Product>): Promise<Product> {
  const newProduct: Product = {
    id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category_id: data.category_id || store.categories[0].id,
    name: data.name || "Untitled Product",
    slug: data.slug || `prod-${Date.now()}`,
    sku: data.sku || `SKU-${Date.now()}`,
    description: data.description || "",
    price: data.price || 0,
    compare_at_price: data.compare_at_price || null,
    stock: data.stock || 0,
    is_active: data.is_active ?? true,
    is_featured: data.is_featured ?? false,
    is_best_seller: data.is_best_seller ?? false,
    is_new_arrival: data.is_new_arrival ?? true,
    rating: 5.0,
    review_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: data.images || [
      {
        id: `img-${Date.now()}`,
        product_id: "",
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        alt_text: data.name || "Product Image",
        sort_order: 0,
      },
    ],
  };

  store.products.unshift(newProduct);
  return attachCategory(newProduct);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.products[index] = {
    ...store.products[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return attachCategory(store.products[index]);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.products.splice(index, 1);
  return true;
}
