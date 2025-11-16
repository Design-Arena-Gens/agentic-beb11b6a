"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserItems } from "@/hooks/useUserItems";
import { useTrades } from "@/hooks/useTrades";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { items } = useUserItems(user?.uid, { category: "All", search: "", view: "grid" });
  const { incoming, outgoing } = useTrades(user?.uid);

  const stats = useMemo(
    () => [
      {
        label: "Active items",
        value: items.length,
        icon: SparklesIcon,
        href: "/items",
        description: "Items ready for trade"
      },
      {
        label: "Incoming offers",
        value: incoming.filter((trade) => trade.status === "pending").length,
        icon: UsersIcon,
        href: "/trades",
        description: "Pending responses"
      },
      {
        label: "Successful trades",
        value: profile?.successfulTrades ?? 0,
        icon: ArrowTrendingUpIcon,
        href: "/trades",
        description: "Celebrated deals"
      }
    ],
    [incoming, items.length, profile?.successfulTrades]
  );

  const recentTrades = [...incoming, ...outgoing]
    .sort(
      (a, b) =>
        (b.createdAt.seconds ?? 0) * 1000 +
        (b.createdAt.nanoseconds ?? 0) / 1e6 -
        ((a.createdAt.seconds ?? 0) * 1000 + (a.createdAt.nanoseconds ?? 0) / 1e6)
    )
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-100">Welcome back</p>
            <h1 className="mt-2 text-4xl font-semibold">
              {profile?.displayName ?? user?.email ?? "Trader"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-100">
              Manage your trades, discover new items, and keep your profile fresh. Exciting deals are
              just a message away.
            </p>
          </div>
          <div className="rounded-3xl bg-white/20 px-6 py-4 text-sm text-primary-50">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-100">Trades completed</p>
                <p className="text-2xl font-semibold">
                  {profile?.successfulTrades ?? 0}/{profile?.tradeCount ?? 0}
                </p>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-100">Member since</p>
                <p className="text-sm">
                  {profile?.createdAt
                    ? formatDistanceToNow(profile.createdAt.toDate(), { addSuffix: true })
                    : "Recently"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-100 p-2 text-primary-600">
                <stat.icon className="h-5 w-5" />
              </span>
              <ArrowRightIcon className="h-5 w-5 text-slate-300 transition group-hover:text-primary-500" />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent trades</h2>
              <p className="text-sm text-slate-500">Track the latest conversations and offers.</p>
            </div>
            <Link
              href="/trades"
              className="text-sm font-semibold text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {recentTrades.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-500">
                No trade activity yet. Visit the marketplace to send your first offer.
              </div>
            ) : (
              recentTrades.map((trade) => (
                <div key={trade.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {trade.status === "pending"
                      ? "Pending offer"
                      : trade.status === "accepted"
                        ? "Accepted trade"
                        : trade.status === "declined"
                          ? "Declined trade"
                          : "Cancelled"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{trade.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDistanceToNow(trade.createdAt.toDate(), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
              <p className="text-sm text-slate-500">Keep your profile vibrant and ready.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <Link
              href="/items"
              className="block rounded-2xl border border-primary-100 bg-primary-50/60 p-4 text-sm font-medium text-primary-600 transition hover:bg-primary-100"
            >
              Add a new item to your collection
            </Link>
            <Link
              href="/marketplace"
              className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Discover items ready for barter
            </Link>
            <Link
              href="/profile"
              className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Refresh your profile details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
