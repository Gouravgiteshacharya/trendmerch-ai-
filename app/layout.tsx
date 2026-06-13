import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "TrendMerch AI",
  description: "Fashion Merchandising & Trend Intelligence Co-Pilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
          <Sidebar />
          <main className="min-w-0 px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
            <div className="mx-auto max-w-[1480px]">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
