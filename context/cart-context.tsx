"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import { Product, ProductVariant } from "@/types/database";
import { siteConfig } from "@/config/site";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  couponCode: string | null;
  applyCoupon: (code: string, discountAmount: number) => void;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "avyzen_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to storage:", e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity: number = 1, variant?: ProductVariant | null) => {
    const unitPrice = variant ? variant.price : product.price;
    const maxStock = variant ? variant.stock : product.stock;
    const itemId = `${product.id}-${variant?.id || "standard"}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const validQty = Math.min(quantity, maxStock);
        if (validQty <= 0) return prev;
        return [
          ...prev,
          {
            id: itemId,
            productId: product.id,
            variantId: variant?.id || null,
            product,
            variant: variant || null,
            quantity: validQty,
            unitPrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.variant ? item.variant.stock : item.product.stock;
          const safeQty = Math.min(quantity, maxStock);
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string, discount: number) => {
    setCouponCode(code);
    setDiscountAmount(discount);
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountAmount(0);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= siteConfig.shipping.freeShippingThreshold || subtotal === 0 ? 0 : siteConfig.shipping.insideDhaka.rate;
  const total = Math.max(0, subtotal - discountAmount + shipping);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount: discountAmount,
        shipping,
        total,
        itemCount,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
