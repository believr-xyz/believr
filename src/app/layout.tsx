import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/styles/globals.css";
import MainLayout from "@/components/layout";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Believr",
  description:
    "Believr is a decentralized social platform where early believers co-invest in creators they believe in and share in their rise. Built on Lens Protocol, it enables creators to launch tokenized posts or campaigns to gain support, while backers earn rewards, access, and a stake in their journey.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={urbanist.className}>
      <body className="antialiased">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
