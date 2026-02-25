import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-950 via-gray-900 to-gray-950 text-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Pokémon Team Evaluator
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Analyze your Pokémon team&apos;s strengths, weaknesses, and type coverage instantly. 
          Build the perfect competitive team.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/evaluate"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Evaluate My Team
          </Link>
          <Link
            href="/builder"
            className="border border-gray-500 hover:border-gray-300 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Team Builder
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Type Coverage Analysis",
              desc: "See your team's offensive and defensive type coverage at a glance with detailed charts.",
              icon: "🔥",
            },
            {
              title: "Weakness Detection",
              desc: "Instantly identify common weaknesses and threats your team is vulnerable to.",
              icon: "⚠️",
            },
            {
              title: "Team Suggestions",
              desc: "Get AI-powered suggestions for Pokémon that complement your existing team.",
              icon: "💡",
            },
            {
              title: "Moveset Analysis",
              desc: "Evaluate move coverage and find gaps in your team's offensive capabilities.",
              icon: "⚡",
            },
            {
              title: "Meta Matchups",
              desc: "See how your team performs against the current competitive meta threats.",
              icon: "🏆",
            },
            {
              title: "All Generations",
              desc: "Support for all Pokémon from Gen 1 to Gen 9, including regional forms and megas.",
              icon: "🌍",
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {[
            { step: "1", title: "Add Your Pokémon", desc: "Search and add up to 6 Pokémon to your team" },
            { step: "2", title: "Set Movesets", desc: "Optionally configure moves, abilities, and items" },
            { step: "3", title: "Get Analysis", desc: "Instant type coverage, weaknesses, and suggestions" },
          ].map((s) => (
            <div key={s.step} className="flex-1 text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="space-y-6">
          {[
            {
              q: "Which Pokémon games are supported?",
              a: "We support all mainline Pokémon games from Red/Blue to Scarlet/Violet, including competitive formats like VGC and Smogon tiers.",
            },
            {
              q: "How accurate is the type coverage analysis?",
              a: "Our analysis uses the complete type chart including all immunities, resistances, and weaknesses from the latest generation.",
            },
            {
              q: "Can I save my teams?",
              a: "Yes! Create a free account to save unlimited teams and access them from any device.",
            },
            {
              q: "Is it free?",
              a: "Completely free! All core features including type analysis, weakness detection, and team suggestions are free to use.",
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Pokémon Team Evaluator. Pokémon is a trademark of Nintendo/Game Freak.</p>
      </footer>
    </main>
  );
}
