"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Order } from "@/types/database";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";
import { OrderInvoicePrint } from "@/components/admin/OrderInvoicePrint";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, Eye, MessageCircle, Printer, Calendar, RefreshCw } from "lucide-react";
import { generateAdminToCustomerWhatsAppUrl, getAdminWhatsAppTemplateMessage } from "@/services/whatsapp";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchOrdersData = async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      try {
        const url = `/api/admin/orders?status=${selectedStatus}&search=${encodeURIComponent(search)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (isMounted && res.ok && data.success) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error("Failed to load orders:", e);
      } finally {
        if (isMounted && showSpinner) setLoading(false);
      }
    };

    fetchOrdersData(true);
    const interval = setInterval(() => fetchOrdersData(false), 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedStatus, search, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const statuses: Array<{ id: string; label: string }> = [
    { id: "ALL", label: "All Orders" },
    { id: "PENDING", label: "Pending" },
    { id: "PAYMENT_PENDING", label: "Payment Pending" },
    { id: "PAID", label: "Paid" },
    { id: "PROCESSING", label: "Processing" },
    { id: "SHIPPED", label: "Shipped" },
    { id: "DELIVERED", label: "Delivered" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  // Calculate order counts per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    for (const o of orders) {
      counts[o.order_status] = (counts[o.order_status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const handleQuickWhatsApp = (order: Order) => {
    const message = getAdminWhatsAppTemplateMessage(
      order,
      order.order_status === "SHIPPED"
        ? "SHIPPED"
        : order.order_status === "DELIVERED"
        ? "DELIVERED"
        : "CONFIRMED"
    );
    const url = generateAdminToCustomerWhatsAppUrl(order.customer_phone, message);
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Order Management & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Review incoming orders, verify payments, print invoices, and update customers via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Auto-Sync (6s)</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-xs transition-all active:scale-95"
            title="Refresh order list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Filter Pills with counts */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {statuses.map((st) => {
            const count = statusCounts[st.id] || 0;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedStatus === st.id
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>{st.label}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      selectedStatus === st.id
                        ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md shadow-xs">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 uppercase font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Order ID & Date</th>
                <th className="py-3.5 px-6">Customer Details</th>
                <th className="py-3.5 px-6">Destination</th>
                <th className="py-3.5 px-6">Items & Total</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Order Status</th>
                <th className="py-3.5 px-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    {loading ? "Loading orders..." : "No orders match your filter criteria."}
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => {
                      setSelectedOrder(o);
                      setModalOpen(true);
                    }}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                  >
                    {/* Order ID & Date */}
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-zinc-950 dark:text-zinc-100 text-sm">
                        {o.order_number}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(o.created_at)}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">
                        {o.customer_name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {o.customer_phone}
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                      <div>{o.area}, {o.city}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {o.city.toLowerCase().includes("dhaka") ? "Dhaka" : "Outside"}
                      </span>
                    </td>

                    {/* Items & Total */}
                    <td className="py-4 px-6">
                      <div className="font-black text-zinc-950 dark:text-white text-sm">
                        {formatPrice(o.total)}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {o.items?.length || 1} item{((o.items?.length || 1) > 1) ? "s" : ""}
                        {o.discount > 0 && (
                          <span className="text-emerald-600 font-semibold ml-1">
                            (-{formatPrice(o.discount)})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 font-semibold text-zinc-700 dark:text-zinc-300">
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px]">
                        {o.payment_method === "COD" ? "Cash on Delivery" : "Online Gateway"}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          o.payment_status === "PAID"
                            ? "success"
                            : o.payment_status === "FAILED"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[11px] font-bold"
                      >
                        {o.payment_status}
                      </Badge>
                    </td>

                    {/* Order Status */}
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="text-[11px] font-bold">
                        {o.order_status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* 1-Click WhatsApp customer chat */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickWhatsApp(o);
                          }}
                          className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                          title="Quick WhatsApp message"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </button>

                        {/* Quick Invoice print */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInvoiceOrder(o);
                          }}
                          className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Manage order modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(o);
                            setModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Workflow Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusUpdated={handleRefresh}
      />

      {/* Direct Quick Invoice Print Modal */}
      {invoiceOrder && (
        <Dialog
          open={!!invoiceOrder}
          onOpenChange={() => setInvoiceOrder(null)}
          className="max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        >
          <OrderInvoicePrint order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
        </Dialog>
      )}
    </div>
  );
}
