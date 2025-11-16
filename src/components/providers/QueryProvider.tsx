"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";

const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
};

export const QueryProvider = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>{children}</SWRConfig>
);
