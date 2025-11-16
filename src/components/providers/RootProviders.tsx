"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toaster";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const RootProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
);
