"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Order } from "@/types/database";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, Eye, Filter, MessageCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const url = `/api/admin/orders?status=${selectedStatus}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Failed to load orders:", e);
    }
  }, [selectedStatus, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statuses = [
    "ALL",
    "PENDING",
    "PAYMENT_PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Order Management & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Review incoming orders, verify payments, update delivery status, and contact customers.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md">
          <Search className="w-4 h-4 text-zinc-400" />
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
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer Details</th>
                <th className="py-3 px-6">Destination</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Payment Method</th>
                <th className="py-3 px-6">Payment Status</th>
                <th className="py-3 px-6">Order Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {o.order_number}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{o.customer_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{o.customer_phone}</div>
                    </td>

                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                      {o.area}, {o.city}
                    </td>

                    <td className="py-4 px-6 font-black text-zinc-950 dark:text-white">
                      {formatPrice(o.total)}
                    </td>

                    <td className="py-4 px-6 font-semibold text-zinc-700 dark:text-zinc-300">
                      {o.payment_method === "COD" ? "Cash on Delivery" : "Online Gateway"}
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant={o.payment_status === "PAID" ? "success" : "secondary"}>
                        {o.payment_status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="outline">{o.order_status}</Badge>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Workflow Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusUpdated={fetchOrders}
      />
    </div>
  );
}
