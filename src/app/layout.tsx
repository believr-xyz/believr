import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/styles/globals.css";
import { Web3Provider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Believr — The social platform for early believers and creators",
  description:
    "Believr is a decentralized social platform where early believers co-invest in creators they believe in and share in their rise. Built on Lens Protocol, it enables creators to launch tokenized posts or campaigns to gain support, while backers earn rewards, access, and a stake in their journey.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={urbanist.className}>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Web3Provider>{children}</Web3Provider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
