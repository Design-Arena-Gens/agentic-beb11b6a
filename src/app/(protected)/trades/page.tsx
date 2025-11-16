"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTrades } from "@/hooks/useTrades";
import { useItemsByIds } from "@/hooks/useItemsByIds";
import { updateTradeStatus } from "@/lib/firestore";
import { useToast } from "@/components/ui/Toaster";
import { formatDistanceToNow } from "date-fns";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const statusCopy: Record<string, string> = {
  pending: "Pending response",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled"
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-rose-100 text-rose-700",
  cancelled: "bg-slate-100 text-slate-500"
};

const TradesPage = () => {
  const { user } = useAuth();
  const { push } = useToast();
  const { incoming, outgoing } = useTrades(user?.uid);

  const itemIds = useMemo(() => {
    const ids = new Set<string>();
    incoming.forEach((trade) => {
      ids.add(trade.senderItemId);
      ids.add(trade.recipientItemId);
    });
    outgoing.forEach((trade) => {
      ids.add(trade.senderItemId);
      ids.add(trade.recipientItemId);
    });
    return Array.from(ids);
  }, [incoming, outgoing]);

  const items = useItemsByIds(itemIds);

  const handleStatusChange = async (tradeId: string, status: "accepted" | "declined") => {
    try {
      await updateTradeStatus(tradeId, status);
      push({
        title: `Trade ${status}`,
        description: "The sender will be notified of your response.",
        tone: "success"
      });
    } catch (error) {
      push({
        title: "Unable to update trade",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Trades</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review incoming offers, track your sent requests, and update statuses as deals progress.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Incoming offers</h2>
              <p className="text-sm text-slate-500">
                These traders are interested in your items. Respond to keep the conversation alive.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {incoming.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-500">
                No incoming offers yet. Share your items to attract more attention.
              </div>
            ) : (
              incoming.map((trade) => {
                const senderItem = items[trade.senderItemId];
                const recipientItem = items[trade.recipientItemId];
                return (
                  <div key={trade.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusColor[trade.status]}`}
                      >
                        {statusCopy[trade.status]}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(trade.createdAt.toDate(), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">Offered:</span>{" "}
                        {senderItem?.title ?? "Unknown item"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">For:</span>{" "}
                        {recipientItem?.title ?? "Your item"}
                      </p>
                      <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                        “{trade.message}”
                      </p>
                    </div>
                    {trade.status === "pending" ? (
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(trade.id, "accepted")}
                          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(trade.id, "declined")}
                          className="flex flex-1 items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-100"
                        >
                          <XCircleIcon className="h-5 w-5" />
                          Decline
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sent offers</h2>
              <p className="text-sm text-slate-500">
                Keep an eye on the offers you&apos;ve shared with other traders.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-sm font-semibold text-primary-600 hover:text-primary-500"
            >
              Explore more items
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {outgoing.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-500">
                Haven&apos;t sent any offers yet. Browse the marketplace to find something exciting.
              </div>
            ) : (
              outgoing.map((trade) => {
                const recipientItem = items[trade.recipientItemId];
                const senderItem = items[trade.senderItemId];
                return (
                  <div key={trade.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusColor[trade.status]}`}
                      >
                        {statusCopy[trade.status]}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(trade.createdAt.toDate(), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">Your offer:</span>{" "}
                        {senderItem?.title ?? "Unknown item"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Hoping to trade for:</span>{" "}
                        {recipientItem?.title ?? "Unknown item"}
                      </p>
                      <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                        “{trade.message}”
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <ClockIcon className="h-4 w-4" />
                      Waiting for response
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TradesPage;
