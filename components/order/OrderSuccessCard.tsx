"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/types/database";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateOrderWhatsAppUrl } from "@/services/whatsapp";
import { CheckCircle2, MessageCircle, Package, ArrowRight, Printer, MapPin, CreditCard } from "lucide-react";

interface OrderSuccessCardProps {
  order: Order;
}

export function OrderSuccessCard({ order }: OrderSuccessCardProps) {
  const whatsappUrl = generateOrderWhatsAppUrl(order);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">
          Order Successfully Confirmed!
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Thank you for shopping with Avyzen Imports. We have received your order and our fulfillment team is preparing it for dispatch.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Header Bar */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
              Order Reference
            </span>
            <span className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {order.order_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                order.payment_status === "PAID"
                  ? "success"
                  : order.payment_method === "COD"
                  ? "secondary"
                  : "warning"
              }
              className="text-xs py-1 px-3"
            >
              Payment: {order.payment_status}
            </Badge>

            <Badge variant="outline" className="text-xs py-1 px-3">
              Status: {order.order_status}
            </Badge>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                Delivery Address
              </span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                {order.customer_name}
              </p>
              <p className="text-zinc-500">
                {order.address}, {order.area}, {order.city}{order.postal_code ? ` - ${order.postal_code}` : ""}
              </p>
              <p className="text-zinc-500 font-mono">
                Phone: {order.customer_phone}
              </p>
              <p className="text-zinc-500">
                Email: {order.customer_email}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                Payment & Timeline
              </span>
              <p className="text-zinc-600 dark:text-zinc-300">
                Method: <strong className="text-zinc-900 dark:text-zinc-100">{order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}</strong>
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                Placed On: <strong className="text-zinc-900 dark:text-zinc-100">{formatDate(order.created_at)}</strong>
              </p>
              {order.delivery_notes && (
                <p className="text-zinc-500 italic mt-2">
                  Notes: &quot;{order.delivery_notes}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Purchased Items
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden relative">
                      <img
                        src={item.image_url || "/images/products/apex-pro.jpg"}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {item.product_name}
                      </p>
                      {item.variant_name && (
                        <p className="text-zinc-400 text-xs">Edition: {item.variant_name}</p>
                      )}
                      <p className="text-zinc-500">
                        {formatPrice(item.unit_price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    {formatPrice(item.total_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-zinc-500 text-xs">
              <span>Subtotal:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 text-xs font-medium">
                <span>Discount ({order.coupon_code || "Promo"}):</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500 text-xs">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-950 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden on print) */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Button
            variant="whatsapp"
            className="gap-2"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Send Order via WhatsApp (+8801939846312)</span>
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              <span>Print Invoice</span>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/track-order?orderNumber=${order.order_number}&phone=${order.customer_phone}`}>
                <Package className="w-4 h-4 mr-2" />
                <span>Track Parcel</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center print:hidden">
        <Button variant="ghost" asChild>
          <Link href="/shop" className="gap-2 text-zinc-500 hover:text-zinc-900">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
