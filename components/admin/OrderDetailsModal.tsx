"use client";

import React, { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types/database";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useToast } from "@/context/toast-context";
import {
  MessageCircle,
  MapPin,
  CreditCard,
  Printer,
  Calendar,
  Phone,
  Mail,
  User,
  Package,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  AdminWhatsAppTemplate,
  getAdminWhatsAppTemplateMessage,
  generateAdminToCustomerWhatsAppUrl,
} from "@/services/whatsapp";
import { OrderInvoicePrint } from "@/components/admin/OrderInvoicePrint";

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
  const [activeTab, setActiveTab] = useState<"details" | "whatsapp" | "invoice">("details");
  const [updating, setUpdating] = useState(false);

  // Status edit state synchronized with order prop
  const [prevOrder, setPrevOrder] = useState<Order | null>(order);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>(
    order?.order_status || "PENDING"
  );
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status || "UNPAID"
  );

  // WhatsApp template & composer state
  const [selectedTemplate, setSelectedTemplate] = useState<AdminWhatsAppTemplate>("CONFIRMED");
  const [customMessage, setCustomMessage] = useState<string>("");

  // Sync state when order prop changes during render (React 19 recommended pattern)
  if (order !== prevOrder) {
    setPrevOrder(order);
    if (order) {
      setNewOrderStatus(order.order_status);
      setNewPaymentStatus(order.payment_status);
      setCustomMessage(getAdminWhatsAppTemplateMessage(order, "CONFIRMED"));
      setSelectedTemplate("CONFIRMED");
    }
  }

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
        showToast(
          `Order #${order.order_number} updated to ${newOrderStatus} (${newPaymentStatus})!`,
          "success"
        );
        onStatusUpdated();
      } else {
        showToast(data.error || "Failed to update order", "error");
      }
    } catch {
      showToast("Network error updating order.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleTemplateChange = (template: AdminWhatsAppTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage(getAdminWhatsAppTemplateMessage(order, template));
  };

  const handleSendWhatsApp = () => {
    const url = generateAdminToCustomerWhatsAppUrl(order.customer_phone, customMessage);
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const whatsappTemplates: Array<{ id: AdminWhatsAppTemplate; label: string; icon: string }> = [
    { id: "CONFIRMED", label: "Order Confirmed", icon: "🛍️" },
    { id: "SHIPPED", label: "Shipped / Dispatched", icon: "🚚" },
    { id: "DELIVERED", label: "Delivered", icon: "✅" },
    { id: "PAYMENT_RECEIVED", label: "Payment Received", icon: "💳" },
    { id: "CANCELLED", label: "Cancelled", icon: "⚠️" },
    { id: "GENERAL", label: "General Chat", icon: "💬" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-3xl p-0 overflow-hidden">
      {/* If invoice tab is active, show the printable invoice preview directly */}
      {activeTab === "invoice" ? (
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <OrderInvoicePrint order={order} onClose={() => setActiveTab("details")} />
        </div>
      ) : (
        <div className="flex flex-col max-h-[85vh]">
          {/* Top Bar Header */}
          <div className="p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">Order Reference</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
                  {order.order_number}
                </h2>
              </div>

              {/* Status Badges & Quick Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    order.payment_status === "PAID"
                      ? "success"
                      : order.payment_status === "FAILED"
                      ? "destructive"
                      : "secondary"
                  }
                  className="px-2.5 py-1 text-xs font-bold"
                >
                  {order.payment_status}
                </Badge>
                <Badge variant="outline" className="px-2.5 py-1 text-xs font-bold">
                  {order.order_status}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("invoice")}
                  className="gap-1.5 text-xs font-bold h-8 ml-1"
                  title="View and print official invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 pt-4 mt-2 border-t border-zinc-200/60 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "details"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Order Overview & Financials</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("whatsapp")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "whatsapp"
                    ? "bg-emerald-600 text-white shadow-xs shadow-emerald-500/20"
                    : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Customer Hub</span>
              </button>
            </div>
          </div>

          {/* Tab Content: Details & Financials */}
          {activeTab === "details" && (
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Customer & Destination Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Customer Info Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    Customer Information
                  </span>
                  <div>
                    <p className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
                      {order.customer_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold hover:text-zinc-950 dark:hover:text-white flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-zinc-400" />
                        {order.customer_phone}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const url = generateAdminToCustomerWhatsAppUrl(
                            order.customer_phone,
                            `Hello ${order.customer_name}, regarding Order #${order.order_number}`
                          );
                          window.open(url, "_blank");
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-bold text-[11px] inline-flex items-center gap-0.5 ml-1"
                      >
                        <MessageCircle className="w-3 h-3 fill-current" />
                        Chat
                      </button>
                    </div>
                    {order.customer_email && (
                      <p className="text-zinc-500 flex items-center gap-1 mt-1 truncate">
                        <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                        {order.customer_email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Destination & Logistics */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    Delivery Destination
                  </span>
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {order.address}
                    </p>
                    <p className="text-zinc-500 mt-0.5">
                      {order.area}, {order.city}{" "}
                      {order.postal_code ? `- ${order.postal_code}` : ""}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold">
                      Zone: {order.city.toLowerCase().includes("dhaka") ? "Inside Dhaka (৳60)" : "Outside Dhaka (৳120)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Notes Callout if present */}
              {order.delivery_notes && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
                  <span className="font-bold block mb-0.5">Customer Delivery Notes:</span>
                  <p className="italic">&quot;{order.delivery_notes}&quot;</p>
                </div>
              )}

              {/* Ordered Products Itemized List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-zinc-400" />
                  Ordered Products ({order.items?.length || 0})
                </h3>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 flex items-center justify-between gap-4 text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 relative border border-zinc-200/80 dark:border-zinc-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_url || "/images/products/apex-pro.jpg"}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                              {item.product_name}
                            </p>
                            {item.variant_name && (
                              <span className="inline-block mt-0.5 text-[11px] px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded font-medium">
                                {item.variant_name}
                              </span>
                            )}
                            <p className="text-zinc-500 text-[11px] mt-0.5">
                              {formatPrice(item.unit_price)} × {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-zinc-950 dark:text-zinc-50 text-sm">
                            {formatPrice(item.total_price)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-zinc-400 text-xs">
                      No items attached to this order.
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Calculation & Payment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Payment Method Details */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2 text-xs">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                    Payment Details
                  </span>
                  <div className="space-y-1">
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Payment Mode:{" "}
                      <strong className="text-zinc-900 dark:text-zinc-100 font-bold">
                        {order.payment_method === "COD"
                          ? "Cash on Delivery (ক্যাশ অন ডেলিভারি)"
                          : "Online Payment Gateway"}
                      </strong>
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Payment Status:{" "}
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {order.payment_status}
                      </span>
                    </p>
                    {order.coupon_code && (
                      <p className="text-emerald-600 font-medium">
                        Coupon Applied: <strong className="font-mono">{order.coupon_code}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subtotal, Shipping, Discount Breakdown */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount ({order.coupon_code || "Promo"}):</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping Fee:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between text-sm sm:text-base font-black text-zinc-950 dark:text-white">
                    <span>Total Amount:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Controls Box */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    Update Order & Payment Workflow
                  </h3>
                  <span className="text-[11px] text-zinc-400">Real-time status synchronisation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Order Fulfillment Status
                    </label>
                    <select
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    >
                      <option value="PENDING">PENDING (অপেক্ষারত)</option>
                      <option value="PAYMENT_PENDING">PAYMENT_PENDING (পেমেন্ট বকেয়া)</option>
                      <option value="PAID">PAID (পরিশোধিত)</option>
                      <option value="PROCESSING">PROCESSING (প্রসেসিং ও প্যাকিং)</option>
                      <option value="SHIPPED">SHIPPED (কুরিয়ারে হস্তান্তর)</option>
                      <option value="DELIVERED">DELIVERED (ডেলিভারি সম্পন্ন)</option>
                      <option value="CANCELLED">CANCELLED (বাতিল)</option>
                      <option value="REFUNDED">REFUNDED (রিফান্ড)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Payment Status
                    </label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    >
                      <option value="UNPAID">UNPAID (পরিশোধ বাকি)</option>
                      <option value="PENDING">PENDING (যাচাই চলছে)</option>
                      <option value="PAID">PAID (পরিশোধিত)</option>
                      <option value="FAILED">FAILED (ব্যর্থ)</option>
                      <option value="REFUNDED">REFUNDED (রিফান্ড সম্পন্ন)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: WhatsApp Customer Hub */}
          {activeTab === "whatsapp" && (
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                      WhatsApp Customer Messaging Hub
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Direct chat with {order.customer_name} ({order.customer_phone})
                    </p>
                  </div>
                </div>

                <Badge variant="success" className="text-xs font-bold">
                  Live Chat Ready
                </Badge>
              </div>

              {/* Template Selectors */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  Select Quick Message Template:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {whatsappTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center gap-2 ${
                        selectedTemplate === tmpl.id
                          ? "border-emerald-600 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                      }`}
                    >
                      <span className="text-sm">{tmpl.icon}</span>
                      <span className="truncate">{tmpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer & Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Edit / Preview WhatsApp Message:
                  </label>
                  <span className="text-zinc-400 font-mono text-[11px]">
                    {customMessage.length} characters
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:outline-none transition-all shadow-xs"
                  placeholder="Type message to customer..."
                />
              </div>

              {/* WhatsApp Launch Banner */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-zinc-500">
                  Clicking will open official WhatsApp Web / App with this message pre-filled.
                </p>

                <Button
                  size="md"
                  variant="whatsapp"
                  onClick={handleSendWhatsApp}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold gap-2 shadow-lg shadow-emerald-500/20 hover:scale-102 transition-transform"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Message via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </Button>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("invoice")}
                className="gap-1.5 text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </Button>

              <Button
                variant="whatsapp"
                size="sm"
                onClick={() => setActiveTab("whatsapp")}
                className="gap-1.5 text-xs font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Hub</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                Close
              </Button>

              <Button
                size="sm"
                variant="primary"
                isLoading={updating}
                onClick={handleUpdate}
                className="gap-1.5 text-xs font-bold shadow-md hover:shadow-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Status Updates</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
