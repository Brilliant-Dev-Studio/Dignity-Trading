import type { Metadata } from "next";

export { default } from "./MarketAnalysisView";

export const metadata: Metadata = {
  title: "Market Analysis",
  description:
    "Weekly and daily forex market analysis — key pairs, session bias, and high-probability setups from Dignity Trading Academy.",
  openGraph: {
    title: "Market Analysis — Dignity Trading",
    description:
      "Regular forex market analysis videos to sharpen your price action reading. Free from Dignity Trading Academy.",
    url: "/resources",
  },
};
