"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Item } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon, PhotoIcon } from "@heroicons/react/24/outline";

type MarketplaceCardProps = {
  item: Item;
  onTrade: (item: Item) => void;
  onShare: (item: Item) => void;
};

const fallback =
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80";

export const MarketplaceCard = ({ item, onTrade, onShare }: MarketplaceCardProps) => {
  const images = useMemo(() => (item.images.length ? item.images : [fallback]), [item.images]);
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 w-full">
        <Image
          src={images[index]}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 20rem, 100vw"
        />
        {images.length > 1 ? (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            <button
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setIndex(idx)}
                  className={`h-2 w-8 rounded-full ${idx === index ? "bg-primary-500" : "bg-white/70"}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <span className="self-start rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
          {item.category}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-600 line-clamp-3">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span>Condition: {item.condition}</span>
          <span>{item.images.length || 1} photo(s)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTrade(item)}
            className="flex-1 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600"
          >
            Offer trade
          </button>
          <button
            onClick={() => onShare(item)}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            <PhotoIcon className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
