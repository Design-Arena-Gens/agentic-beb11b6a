"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserItems } from "@/hooks/useUserItems";
import { ItemForm } from "@/components/items/ItemForm";
import { ItemCard } from "@/components/items/ItemCard";
import { useToast } from "@/components/ui/Toaster";
import { createItem, deleteItem, updateItem } from "@/lib/firestore";
import { uploadItemImages } from "@/lib/storage";
import { ITEM_CATEGORIES } from "@/constants";
import type { Item } from "@/types";
import {
  PlusCircleIcon,
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon
} from "@heroicons/react/24/outline";

const ItemsPage = () => {
  const { user } = useAuth();
  const { push } = useToast();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | (typeof ITEM_CATEGORIES)[number]>("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const { items, loading } = useUserItems(user?.uid, {
    view,
    search,
    category
  });

  const handleCreateOrUpdate = async (values: {
    id?: string;
    title: string;
    description: string;
    tags: string[];
    category: Item["category"];
    condition: Item["condition"];
    existingImages: string[];
    newFiles: File[];
  }) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const uploaded = values.newFiles.length
        ? await uploadItemImages(user.uid, values.newFiles)
        : [];
      const finalImages = [...values.existingImages, ...uploaded];
      if (finalImages.length === 0) {
        throw new Error("Please add at least one image to showcase your item.");
      }

      if (values.id) {
        await updateItem(values.id, {
          title: values.title,
          description: values.description,
          tags: values.tags,
          category: values.category,
          condition: values.condition,
          images: finalImages
        });
        push({ title: "Item updated", tone: "success" });
      } else {
        await createItem(user.uid, {
          title: values.title,
          description: values.description,
          tags: values.tags,
          category: values.category,
          condition: values.condition,
          images: finalImages
        });
        push({ title: "Item created", tone: "success" });
      }
      setShowForm(false);
      setEditingItem(undefined);
    } catch (error) {
      push({
        title: "Unable to save item",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete ${item.title}?`)) return;
    try {
      await deleteItem(item.id);
      push({ title: "Item removed", tone: "success" });
    } catch (error) {
      push({
        title: "Unable to delete item",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    }
  };

  const handleShare = async (item: Item) => {
    const shareData = {
      title: `Trade: ${item.title}`,
      text: `${item.title} - ${item.description}`,
      url: `${window.location.origin}/marketplace?item=${item.id}`
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        push({ title: "Link copied", description: shareData.url, tone: "success" });
      }
    } catch (error) {
      push({
        title: "Unable to share",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">My items</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage items you&apos;re offering up for trade.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(undefined);
          }}
          className="flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add item
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search your items"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-slate-200 px-10 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <FunnelIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="All">All categories</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`rounded-full p-2 ${view === "grid" ? "bg-primary-100 text-primary-600" : "text-slate-500 hover:bg-slate-100"}`}
            aria-label="Grid view"
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-full p-2 ${view === "list" ? "bg-primary-100 text-primary-600" : "text-slate-500 hover:bg-slate-100"}`}
            aria-label="List view"
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/40 p-12 text-center text-sm text-slate-500">
          Loading your items…
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-primary-200 bg-primary-50/40 p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-primary-600">No items yet</p>
          <p className="max-w-sm text-sm">
            Add your first item to start trading. Showcase multiple photos and tag categories for
            better discovery.
          </p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(undefined);
            }}
            className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600"
          >
            Create item
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              variant="grid"
              onEdit={(selected) => {
                setEditingItem(selected);
                setShowForm(true);
              }}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              variant="list"
              onEdit={(selected) => {
                setEditingItem(selected);
                setShowForm(true);
              }}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingItem ? "Edit item" : "Create item"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Share clear descriptions and high-quality photos to attract the best trade offers.
            </p>
            <div className="mt-6">
              <ItemForm
                initialItem={editingItem}
                submitting={submitting}
                onSubmit={async (payload) => {
                  await handleCreateOrUpdate(payload);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(undefined);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ItemsPage;
