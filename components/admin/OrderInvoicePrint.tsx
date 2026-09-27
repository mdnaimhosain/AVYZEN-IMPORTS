"use client";

import React from "react";
import { Order } from "@/types/database";
import { formatPrice, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderInvoicePrintProps {
  order: Order;
  onClose?: () => void;
}

export function OrderInvoicePrint({ order, onClose }: OrderInvoicePrintProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl border border-zinc-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
      {/* Top action bar - hidden during print */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Invoice Preview
          </span>
          <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full font-semibold">
            INV-{order.order_number}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            onClick={handlePrint}
            className="gap-2 font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice (A4)</span>
          </Button>

          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose} className="gap-1.5">
              <X className="w-4 h-4" />
              <span>Back</span>
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Document Body */}
      <div className="space-y-8 print:text-[12px]">
        {/* Header: Company & Invoice Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b-2 border-zinc-900">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Avyzen Imports"
                className="w-8 h-8 rounded-full border border-zinc-300 object-contain"
              />
              <h1 className="text-2xl font-black tracking-tight uppercase text-zinc-950">
                {siteConfig.name}
              </h1>
            </div>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Curated International & Luxury Lifestyle Imports
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Dhaka, Bangladesh • Helpline: +8801939846312
            </p>
            <p className="text-xs text-zinc-500 font-mono">
              https://avyzenimports.com
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded bg-zinc-950 text-white text-xs font-black tracking-widest uppercase">
              TAX INVOICE / RECEIPT
            </span>
            <div className="text-sm font-bold font-mono text-zinc-900 pt-1">
              INV-{order.order_number}
            </div>
            <div className="text-xs text-zinc-500">
              Date: <span className="font-semibold text-zinc-800">{formatDate(order.created_at)}</span>
            </div>
            <div className="text-xs text-zinc-500">
              Order Ref: <span className="font-mono font-bold text-zinc-800">{order.order_number}</span>
            </div>
          </div>
        </div>

        {/* Billed To / Delivery Info & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 print:bg-transparent print:border print:p-3">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
              Billed & Delivered To
            </span>
            <p className="text-sm font-bold text-zinc-950">{order.customer_name}</p>
            <p className="text-xs text-zinc-700">{order.address}</p>
            <p className="text-xs text-zinc-700">
              {order.area}, {order.city} {order.postal_code ? `- ${order.postal_code}` : ""}
            </p>
            <p className="text-xs font-mono text-zinc-800 font-semibold pt-0.5">
              Phone: {order.customer_phone}
            </p>
            {order.customer_email && (
              <p className="text-xs text-zinc-600">{order.customer_email}</p>
            )}
            {order.delivery_notes && (
              <p className="text-xs text-amber-700 italic pt-1">
                Note: &quot;{order.delivery_notes}&quot;
              </p>
            )}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
              Payment & Logistics
            </span>
            <p className="text-xs text-zinc-700">
              Payment Method:{" "}
              <strong className="text-zinc-950 font-bold">
                {order.payment_method === "COD" ? "Cash on Delivery (ক্যাশ অন ডেলিভারি)" : "Online Gateway"}
              </strong>
            </p>
            <p className="text-xs text-zinc-700">
              Payment Status:{" "}
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  order.payment_status === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.payment_status}
              </span>
            </p>
            <p className="text-xs text-zinc-700 pt-1">
              Fulfillment Status:{" "}
              <span className="font-bold text-zinc-900">{order.order_status}</span>
            </p>
            <p className="text-xs text-zinc-500">
              Shipping Zone: {order.city.toLowerCase().includes("dhaka") ? "Inside Dhaka" : "Outside Dhaka"}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200">
                <th className="py-2.5 px-4 w-12 text-center">#</th>
                <th className="py-2.5 px-4">Item & Specification</th>
                <th className="py-2.5 px-4 text-center w-20">Qty</th>
                <th className="py-2.5 px-4 text-right w-28">Unit Price</th>
                <th className="py-2.5 px-4 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 text-center font-mono text-zinc-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-900 text-xs sm:text-sm">
                        {item.product_name}
                      </div>
                      {item.variant_name && (
                        <div className="text-[11px] text-zinc-500 font-medium">
                          Edition/Variant: {item.variant_name}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-zinc-800">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-700">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-zinc-950">
                      {formatPrice(item.total_price)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-zinc-400">
                    No items recorded for this order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Summary Calculation */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
          <div className="text-xs text-zinc-500 max-w-sm space-y-2">
            <span className="font-bold uppercase tracking-wider text-zinc-700 block">
              Terms & Customer Notice
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-zinc-600">
              <li>Please inspect the package at the time of delivery.</li>
              <li>A 7-day replacement warranty applies for manufacturing defects with unboxing video proof.</li>
              <li>For support or queries, contact WhatsApp +8801939846312.</li>
            </ul>
          </div>

          <div className="w-full sm:w-72 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2.5 print:bg-transparent print:border print:p-3">
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-bold text-zinc-900">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>Discount ({order.coupon_code || "Promo"}):</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>Delivery Charge:</span>
              <span className="font-bold text-zinc-900">
                {order.shipping_fee === 0 ? "FREE (৳0)" : formatPrice(order.shipping_fee)}
              </span>
            </div>

            <div className="pt-2 border-t border-zinc-300 flex justify-between text-base font-black text-zinc-950">
              <span>Total Payable:</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            {order.payment_method === "COD" && order.payment_status !== "PAID" && (
              <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-semibold text-center mt-2">
                Due upon delivery: {formatPrice(order.total)}
              </div>
            )}
          </div>
        </div>

        {/* Footer Signature & Watermark */}
        <div className="pt-12 sm:pt-16 mt-8 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-zinc-400">
          <div>
            <p className="font-medium text-zinc-600">Thank you for choosing {siteConfig.name}!</p>
            <p className="text-[10px] text-zinc-400">This is a system-generated electronic invoice.</p>
          </div>

          <div className="text-center sm:text-right border-t border-zinc-400 pt-2 w-48">
            <span className="font-bold text-zinc-700 text-xs block">Authorized Signature</span>
            <span className="text-[10px] text-zinc-400">Avyzen Imports Logistics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
