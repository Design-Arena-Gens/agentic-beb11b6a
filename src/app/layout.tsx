import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/components/providers/RootProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barter Qween",
  description: "Trade items you don't need for things you want."
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <RootProviders>{children}</RootProviders>
    </body>
  </html>
);

export default RootLayout;
