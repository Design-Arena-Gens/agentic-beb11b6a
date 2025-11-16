"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";

const ProtectedLayout = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
);

export default ProtectedLayout;
