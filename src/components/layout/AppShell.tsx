"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Bars3Icon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/items", label: "My Items" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/trades", label: "Trades" },
  { href: "/profile", label: "Profile" }
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { profile, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <Bars3Icon className="h-6 w-6 text-slate-700" />
            </button>
            <Link href="/dashboard" className="text-xl font-semibold text-primary-600">
              Barter Qween
            </Link>
          </div>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  pathname === item.href
                    ? "bg-primary-100 text-primary-600"
                    : "hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-primary-300 hover:text-primary-600"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <div className="flex items-center gap-2">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                  {profile?.displayName?.slice(0, 1) ?? "U"}
                </div>
              )}
              <div className="hidden text-sm leading-tight md:block">
                <p className="font-semibold text-slate-800">{profile?.displayName}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-rose-300 hover:text-rose-500"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
        {mobileOpen ? (
          <nav className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <ul className="space-y-2 text-sm font-medium text-slate-600">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-full px-3 py-2 ${
                      pathname === item.href
                        ? "bg-primary-100 text-primary-600"
                        : "hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">{children}</main>
    </div>
  );
};
