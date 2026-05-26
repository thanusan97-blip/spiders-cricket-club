import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spiders Sports Club UK",
  description: "Official website of Spiders Sports Club UK",
  manifest: "/manifest.json",
  icons: {
     icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Spiders Sports Club UK",
    description: "Official website of Spiders Sports Club UK",
    url: "https://spiderssportsclubuk.com",
    siteName: "Spiders Sports Club UK",
    images: [
      {
        url: "/gallery/photo2.jpeg",
        width: 1200,
        height: 630,
        alt: "Spiders Sports Club UK",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}