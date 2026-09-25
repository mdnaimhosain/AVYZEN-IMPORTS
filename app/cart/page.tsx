"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle, ShieldCheck } from "lucide-react";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, discount, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8">
          Browse our curated catalog of authentic imported gadgets, audiophile gear, and lifestyle products.
        </p>
        <Button asChild size="lg" className="font-bold">
          <Link href="/shop">Explore Collection</Link>
        </Button>
      </div>
    );
  }

  const freeShippingGap = Math.max(0, siteConfig.shipping.freeShippingThreshold - subtotal);

  return (
    <div className="py-12 bg-zinc-50/50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Review items in your bag before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:underline"
          >
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table (Left 8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={item.product.images?.[0]?.image_url || "/images/products/apex-pro.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:underline line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">
                        Edition: {item.variant.name}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>

                {/* Quantity & Item Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-zinc-900 dark:text-zinc-100 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-zinc-950 dark:text-white min-w-20 text-right">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary (Right 4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>

            {freeShippingGap > 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
                Add <strong className="font-bold">{formatPrice(freeShippingGap)}</strong> more for <strong>FREE Delivery</strong> across Bangladesh!
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                🎉 You have qualified for FREE Delivery!
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {subtotal >= siteConfig.shipping.freeShippingThreshold ? "FREE" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black text-zinc-950 dark:text-white pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button asChild size="lg" className="w-full text-base font-bold shadow-lg">
                <Link href="/checkout" className="justify-between">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button
                variant="whatsapp"
                className="w-full text-xs gap-2"
                onClick={() => {
                  const summary = items
                    .map((i) => `${i.product.name}${i.variant ? ` (${i.variant.name})` : ""} × ${i.quantity}`)
                    .join(", ");
                  const waUrl = generateCustomerSupportUrl(
                    `Hello Avyzen Imports, I'd like to place an order via WhatsApp: ${summary}. Estimated total: ${formatPrice(total)}.`
                  );
                  window.open(waUrl, "_blank");
                }}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order via WhatsApp</span>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Genuine Product & Safe Delivery Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
