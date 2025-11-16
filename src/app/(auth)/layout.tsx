"use client";

import type { ReactNode } from "react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center py-16 px-6">
      <header className="mb-10 text-center">
        <Link href="/" className="text-3xl font-semibold text-primary-600">
          Barter Qween
        </Link>
        <p className="mt-2 text-sm text-slate-500">
          Trade items you don&apos;t need for things you love.
        </p>
      </header>
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-primary-200/60">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
