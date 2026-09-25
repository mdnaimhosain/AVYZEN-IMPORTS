"use client";

import React, { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types/database";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useToast } from "@/context/toast-context";
import { MessageCircle, MapPin, CreditCard, Clock, Truck, ShieldCheck } from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export function OrderDetailsModal({
  order,
  open,
  onClose,
  onStatusUpdated,
}: OrderDetailsModalProps) {
  const { showToast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>(
    order?.order_status || "PENDING"
  );
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status || "UNPAID"
  );

  React.useEffect(() => {
    if (order) {
      setNewOrderStatus(order.order_status);
      setNewPaymentStatus(order.payment_status);
    }
  }, [order]);

  if (!order) return null;

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Order #${order.order_number} status updated to ${newOrderStatus}!`, "success");
        onStatusUpdated();
        onClose();
      } else {
        showToast(data.error || "Failed to update order", "error");
      }
    } catch {
      showToast("Network error updating order.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const customerCleanPhone = order.customer_phone.replace(/\D/g, "");
  const customerWhatsAppUrl = `https://wa.me/${
    customerCleanPhone.startsWith("88") ? customerCleanPhone : `88${customerCleanPhone}`
  }?text=${encodeURIComponent(
    `Hello ${order.customer_name}, this is Avyzen Imports regarding your Order #${order.order_number}. Current status: ${order.order_status}.`
  )}`;

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-2xl">
      <div className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-xs text-zinc-400 font-mono block">Order Reference</span>
            <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
              {order.order_number}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{order.order_status}</Badge>
            <Badge variant={order.payment_status === "PAID" ? "success" : "secondary"}>
              {order.payment_status}
            </Badge>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
              Customer Info
            </span>
            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{order.customer_name}</p>
            <p className="text-zinc-500 font-mono">{order.customer_phone}</p>
            <p className="text-zinc-500">{order.customer_email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
              Delivery Destination
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">{order.address}</p>
            <p className="text-zinc-500">
              {order.area}, {order.city} {order.postal_code ? `- ${order.postal_code}` : ""}
            </p>
            {order.delivery_notes && (
              <p className="text-zinc-500 italic">Notes: &quot;{order.delivery_notes}&quot;</p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Ordered Products
          </h3>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-48 overflow-y-auto pr-1">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{item.product_name}</p>
                  {item.variant_name && <p className="text-zinc-400 text-[11px]">{item.variant_name}</p>}
                  <p className="text-zinc-500">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(item.total_price)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between text-sm font-black">
            <span>Order Total:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Update Status Controls */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Update Workflow Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Order Status</label>
              <select
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">Payment Status</label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold"
              >
                <option value="UNPAID">UNPAID</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() => window.open(customerWhatsAppUrl, "_blank")}
            className="gap-2 text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Chat Customer on WhatsApp</span>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" isLoading={updating} onClick={handleUpdate}>
              Save Status Updates
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
