import {
  Geist,
  Geist_Mono,
  Inter,
  Konkhmer_Sleokchher,
} from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import QueryProvider from "../providers/react-query";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Konkhmer_Sleokchher({
  weight: "400",
  variable: "--font-konkhmer-sleokchher",
  subsets: ["khmer"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
