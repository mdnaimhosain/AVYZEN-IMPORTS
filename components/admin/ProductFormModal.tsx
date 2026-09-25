"use client";

import React, { useState, useEffect } from "react";
import { Product, Category } from "@/types/database";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/context/toast-context";
import { slugify } from "@/lib/utils";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  onSaved: () => void;
}

export function ProductFormModal({ open, onClose, product, categories, onSaved }: ProductFormModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.category_id);
      setSku(product.sku);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCompareAtPrice(product.compare_at_price ? product.compare_at_price.toString() : "");
      setStock(product.stock.toString());
      setImageUrl(product.images?.[0]?.image_url || "");
      setIsFeatured(product.is_featured);
      setIsBestSeller(product.is_best_seller);
      setIsNewArrival(product.is_new_arrival);
      setIsActive(product.is_active);
    } else {
      setName("");
      setCategoryId(categories[0]?.id || "");
      setSku(`AV-${Date.now().toString().slice(-6)}`);
      setDescription("");
      setPrice("");
      setCompareAtPrice("");
      setStock("10");
      setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800");
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsNewArrival(true);
      setIsActive(true);
    }
  }, [product, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        id: product ? product.id : undefined,
        name: name.trim(),
        slug: slugify(name),
        categoryId,
        sku: sku.trim(),
        description: description.trim(),
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock, 10),
        imageUrl: imageUrl.trim() || null,
        isFeatured,
        isBestSeller,
        isNewArrival,
        isActive,
      };

      const method = product ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(product ? "Product updated successfully!" : "Product created successfully!", "success");
        onSaved();
        onClose();
      } else {
        showToast(data.error || "Failed to save product", "error");
      }
    } catch {
      showToast("Network error saving product.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Product Title *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Avyzen Pulse Wireless Earbuds"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              SKU Identifier *
            </label>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="AV-PULSE-01"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Price (৳ BDT) *
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4990"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Compare at Price (Original ৳)
            </label>
            <Input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="5990"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Initial Stock Units *
            </label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Product Image URL
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded"
            />
            <span>Featured</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="rounded"
            />
            <span>Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="rounded"
            />
            <span>New Arrival</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <span>Active in Shop</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Save Product
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
