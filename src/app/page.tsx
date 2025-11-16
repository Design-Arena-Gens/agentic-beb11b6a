"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-semibold text-primary-600">
          Barter Qween
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link
            href="/login"
            className="rounded-full border border-primary-200 px-4 py-1.5 text-primary-600 transition hover:bg-primary-100"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary-500 px-4 py-1.5 text-white shadow hover:bg-primary-600"
          >
            Get started
          </Link>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-600 shadow">
          Modern trading
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-slate-900">
          Trade items you don&apos;t need for the treasures you want.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Barter Qween helps you discover, showcase, and trade unique items with a vibrant
          community. Sign up to unlock secure trades, rich profiles, and real-time offers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-primary-200 px-6 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-100"
          >
            Explore marketplace
          </Link>
        </div>
        <div className="mt-12 grid w-full max-w-4xl gap-6 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-md md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Trusted authentication</h3>
            <p className="mt-2 text-sm text-slate-500">
              Secure email, passwordless Google sign-in, and persistent sessions keep your trades
              safe.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Smart marketplace</h3>
            <p className="mt-2 text-sm text-slate-500">
              Showcase up to five photos per item, search in real-time, and filter by curated
              categories.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Rich trade offers</h3>
            <p className="mt-2 text-sm text-slate-500">
              Message other traders, track statuses, and celebrate successful barter stories.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
