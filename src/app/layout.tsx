import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Team Evaluator - Analyze Team Strengths & Weaknesses",
  description:
    "Free online Pokémon team analyzer. Check type coverage, find weaknesses, and get team suggestions for competitive battles. Supports all generations.",
  keywords: [
    "pokemon team evaluator",
    "pokemon team analyzer",
    "pokemon type coverage",
    "pokemon team builder",
    "pokemon weakness checker",
    "competitive pokemon team",
    "pokemon team rating",
  ],
  openGraph: {
    title: "Pokémon Team Evaluator - Analyze Team Strengths & Weaknesses",
    description:
      "Free Pokémon team analyzer with type coverage, weakness detection, and team suggestions.",
    type: "website",
    url: "https://pokemonteamevaluator.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
