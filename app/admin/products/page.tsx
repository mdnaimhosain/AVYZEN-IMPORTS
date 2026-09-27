"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Category } from "@/types/database";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/toast-context";
import { Plus, Edit2, Trash2, Search, ExternalLink, Package } from "lucide-react";

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Default categories for selector
    setCategories([
      { id: "c1000000-0000-0000-0000-000000000001", name: "Audio & Sound", slug: "audio", description: null, image: null, is_active: true, created_at: "", updated_at: "" },
      { id: "c1000000-0000-0000-0000-000000000002", name: "Electronics", slug: "electronics", description: null, image: null, is_active: true, created_at: "", updated_at: "" },
      { id: "c1000000-0000-0000-0000-000000000003", name: "Smart Gadgets", slug: "smart-gadgets", description: null, image: null, is_active: true, created_at: "", updated_at: "" },
      { id: "c1000000-0000-0000-0000-000000000004", name: "Lifestyle & Luxury", slug: "lifestyle", description: null, image: null, is_active: true, created_at: "", updated_at: "" },
    ]);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Product "${name}" deleted.`, "info");
        fetchData();
      } else {
        showToast("Failed to delete product.", "error");
      }
    } catch {
      showToast("Error deleting product.", "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Products Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Create, edit prices, monitor warehouse stock, and organize imported gear.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="gap-2 font-bold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter by product title or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 uppercase font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Stock</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                        <Image
                          src={p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200"}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {p.is_featured && <Badge variant="default" className="text-[10px] py-0 px-1.5">Featured</Badge>}
                          {p.is_best_seller && <Badge variant="warning" className="text-[10px] py-0 px-1.5">Best Seller</Badge>}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-semibold text-zinc-600 dark:text-zinc-400">
                      {p.sku}
                    </td>

                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300">
                      {p.category?.name || "General"}
                    </td>

                    <td className="py-4 px-6 font-black text-zinc-950 dark:text-white">
                      {formatPrice(p.price)}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`font-bold ${
                          p.stock <= 5
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant={p.is_active ? "success" : "secondary"}>
                        {p.is_active ? "Active" : "Draft"}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="View Product Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Product Create/Edit Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSaved={fetchData}
      />
    </div>
  );
}
