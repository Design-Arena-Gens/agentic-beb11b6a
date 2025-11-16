"use client";

import { useMemo, useState } from "react";
import { ITEM_CATEGORIES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useMarketplaceItems } from "@/hooks/useMarketplaceItems";
import { useUserItems } from "@/hooks/useUserItems";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { TradeOfferModal } from "@/components/trade/TradeOfferModal";
import { createTradeOffer } from "@/lib/firestore";
import { useToast } from "@/components/ui/Toaster";
import type { Item } from "@/types";
import {
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

const MarketplacePage = () => {
  const { user } = useAuth();
  const { push } = useToast();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | (typeof ITEM_CATEGORIES)[number]>("All");
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sending, setSending] = useState(false);

  const marketplaceItems = useMarketplaceItems({ view, search, category });
  const { items: myItems } = useUserItems(user?.uid, { view, search: "", category: "All" });

  const filtered = useMemo(
    () => marketplaceItems.filter((item) => (user ? item.ownerId !== user.uid : true)),
    [marketplaceItems, user]
  );

  const handleShare = async (item: Item) => {
    const shareData = {
      title: `Trade: ${item.title}`,
      text: item.description,
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

  const initiateTrade = (item: Item) => {
    if (!user) {
      push({
        title: "Log in required",
        description: "You need an account to send trade offers.",
        tone: "error"
      });
      return;
    }
    if (myItems.length === 0) {
      push({
        title: "Add items first",
        description: "Create at least one item before trading.",
        tone: "error"
      });
      return;
    }
    setSelectedItem(item);
    setTradeModalOpen(true);
  };

  const submitTrade = async ({ senderItemId, message }: { senderItemId: string; message: string }) => {
    if (!user || !selectedItem) return;
    setSending(true);
    try {
      await createTradeOffer({
        senderId: user.uid,
        recipientId: selectedItem.ownerId,
        senderItemId,
        recipientItemId: selectedItem.id,
        message
      });
      push({
        title: "Trade offer sent",
        description: "We’ll notify the owner once they respond.",
        tone: "success"
      });
      setTradeModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      push({
        title: "Unable to send trade",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
      throw error;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Marketplace</h1>
          <p className="mt-1 text-sm text-slate-500">
            Discover items from the community and send thoughtful trade offers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`rounded-full p-2 ${view === "grid" ? "bg-primary-100 text-primary-600" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-full p-2 ${view === "list" ? "bg-primary-100 text-primary-600" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search items, categories, keywords"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-full border border-slate-200 px-10 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-slate-400" />
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
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary-200 bg-primary-50/30 p-12 text-center text-sm text-primary-600">
          No items match your current filters. Try adjusting your search or categories.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <MarketplaceCard
              key={item.id}
              item={item}
              onTrade={initiateTrade}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row"
            >
              <MarketplaceCard item={item} onTrade={initiateTrade} onShare={handleShare} />
            </div>
          ))}
        </div>
      )}

      <TradeOfferModal
        open={tradeModalOpen}
        onClose={() => {
          setTradeModalOpen(false);
          setSelectedItem(null);
        }}
        recipientItem={selectedItem}
        userItems={myItems}
        onSubmit={submitTrade}
        submitting={sending}
      />
    </div>
  );
};

export default MarketplacePage;
