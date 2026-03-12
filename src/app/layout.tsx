import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokemon Team Evaluator - Free Gen 9 Team Analyzer & Builder",
  description:
    "Pokemon Team Evaluator is the ultimate pokemonteamevaluator tool for Gen 9 trainers. Analyze your pokemon team for free with pokemonteamevaluator and find weaknesses instantly.",
  keywords:
    "pokemonteamevaluator, pokemon team evaluator, pokemon team analyzer, pokemon team builder, pokemon weakness checker, competitive pokemon, pokemon type chart",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Russo+One&display=swap" rel="stylesheet" />
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
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased font-medium selection:bg-accent/30">
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🔥</span>
              <span className="font-black text-xl tracking-tighter text-slate-100 uppercase italic">
                POKEMON TEAM <span className="text-accent">EVALUATOR</span>
              </span>
            </a>
            <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
              <a href="/" className="hover:text-accent transition-colors">Home</a>
              <a href="/about" className="hover:text-accent transition-colors">About</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
