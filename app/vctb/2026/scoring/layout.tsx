import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VCTB Scoring",
  description: "VCTB 3.0 Live Cricket Scoring Centre",
  manifest: "/vctb-scoring.webmanifest",
  applicationName: "VCTB Scoring",
  appleWebApp: {
    capable: true,
    title: "VCTB Scoring",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/vctb/2026/vctb-3-logo.png",
    icon: "/vctb/2026/vctb-3-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function VCTBScoringLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}