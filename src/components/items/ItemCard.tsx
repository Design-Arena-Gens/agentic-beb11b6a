"use client";

import Image from "next/image";
import { format } from "date-fns";
import { PhotoIcon, PencilSquareIcon, TrashIcon, ShareIcon } from "@heroicons/react/24/outline";
import type { Item } from "@/types";

type ItemCardProps = {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onShare?: (item: Item) => void;
  variant?: "grid" | "list";
};

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80";

export const ItemCard = ({ item, onEdit, onDelete, onShare, variant = "grid" }: ItemCardProps) => {
  const createdAt = "seconds" in item.createdAt ? item.createdAt.toDate() : new Date();
  const primaryImage = item.images[0] ?? fallbackImage;

  if (variant === "list") {
    return (
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md md:flex-row">
        <div className="relative h-40 w-full overflow-hidden rounded-xl md:w-48">
          <Image
            src={primaryImage}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 12rem, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-xs uppercase tracking-wide text-primary-500">{item.category}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              {format(createdAt, "MMM d, yyyy")}
            </span>
          </div>
          <p className="text-sm text-slate-600 line-clamp-3">{item.description}</p>
          <div className="flex gap-2">
            {item.images.slice(0, 3).map((url) => (
              <div key={url} className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image src={url} alt={item.title} fill className="object-cover" sizes="64px" />
              </div>
            ))}
            {item.images.length === 0 ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-300">
                <PhotoIcon className="h-6 w-6" />
              </div>
            ) : null}
          </div>
          <div className="mt-auto flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-1 rounded-full border border-primary-200 px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-100"
            >
              <PencilSquareIcon className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={() => onDelete(item)}
              className="flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
            >
              <TrashIcon className="h-4 w-4" /> Delete
            </button>
            <button
              onClick={() => onShare?.(item)}
              className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              <ShareIcon className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full">
        <Image
          src={primaryImage}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 18rem, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="text-xs uppercase tracking-wide text-primary-500">{item.category}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            {format(createdAt, "MMM d")}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span>{item.tags.join(", ")}</span>
          <span>{item.condition}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex flex-1 items-center justify-center gap-1 rounded-full border border-primary-200 px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-100"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={() => onShare?.(item)}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            <ShareIcon className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
