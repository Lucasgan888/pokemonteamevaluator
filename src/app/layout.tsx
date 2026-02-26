import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Team Evaluator - Analyze Team Strengths & Weaknesses Free",
  description:
    "Free online Pokémon team analyzer. Check type coverage, find shared weaknesses, and get a team score. Supports all 18 types. Build the perfect competitive team.",
  keywords:
    "pokemon team evaluator, pokemon team analyzer, pokemon type coverage, pokemon team builder, pokemon weakness checker, competitive pokemon, pokemon team rating, pokemon type chart",
  openGraph: {
    title: "Pokémon Team Evaluator - Analyze Team Strengths & Weaknesses Free",
    description:
      "Analyze your Pokémon team's type coverage, weaknesses, and score. Free online tool for competitive team building.",
    url: "https://pokemonteamevaluator.com",
    siteName: "Pokémon Team Evaluator",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokémon Team Evaluator",
    description: "Analyze your Pokémon team's strengths and weaknesses instantly. Free online tool.",
  },
  alternates: {
    canonical: "https://pokemonteamevaluator.com",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2L9LTYKF0X" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-2L9LTYKF0X');` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Pokémon Team Evaluator",
              url: "https://pokemonteamevaluator.com",
              description: "Free online Pokémon team type coverage and weakness analyzer",
              applicationCategory: "Game",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </head>
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-lg text-red-500">Pokémon Team Evaluator</span>
            </a>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="/" className="hover:text-red-500 transition">Home</a>
              <a href="/about" className="hover:text-red-500 transition">About</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-16 py-8 text-center text-sm text-gray-500">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6 p-4 border border-dashed border-gray-700 rounded text-gray-600 text-xs">
              Advertisement Space
            </div>
            <p>© {new Date().getFullYear()} Pokémon Team Evaluator. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="/privacy" className="hover:text-red-500 transition">Privacy</a>
              <a href="/terms" className="hover:text-red-500 transition">Terms</a>
            </div>
            <p className="mt-2 text-gray-600 text-xs">
              Pokémon is a trademark of Nintendo/Game Freak. This is a fan-made tool.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
