import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Inflation Survival Platform",
  description:
    "Track prices, compare cities, and forecast inflation to optimize your cost of living.",
  keywords: ["inflation", "cost of living", "price tracker", "city comparison"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-gray-100">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
