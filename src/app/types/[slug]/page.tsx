import { notFound } from "next/navigation";
import Link from "next/link";
import { TYPE_GUIDES } from "@/lib/content";
import { TYPE_COLORS, PokemonType } from "@/lib/pokemon";

function TypeBadge({ type }: { type: PokemonType }) {
  return (
    <span className={`${TYPE_COLORS[type]} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
      {type}
    </span>
  );
}

export default async function TypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = TYPE_GUIDES.find(g => g.slug === slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="text-red-500 hover:text-red-400 text-sm mb-8 inline-block">
        ← Back to Team Evaluator
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <TypeBadge type={guide.type} />
          <h1 className="text-4xl font-extrabold">{guide.title}</h1>
        </div>
        <p className="text-xl text-gray-400 leading-relaxed">{guide.intro}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-red-400">Offensive Strengths</h2>
          <div className="flex flex-wrap gap-2">
            {guide.strengths.map(s => <TypeBadge key={s} type={s as PokemonType} />)}
          </div>
          <p className="mt-4 text-sm text-gray-500">Super effective against these types.</p>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-red-400">Defensive Weaknesses</h2>
          <div className="flex flex-wrap gap-2">
            {guide.weaknesses.map(w => <TypeBadge key={w} type={w as PokemonType} />)}
          </div>
          <p className="mt-4 text-sm text-gray-500">Takes double damage from these types.</p>
        </div>
      </div>

      <div className="space-y-12">
        {guide.sections.map(section => (
          <section key={section.title}>
            <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
            <div className="prose prose-invert max-w-none text-gray-400">
              {section.content}
            </div>
          </section>
        ))}

        <section className="bg-red-950/20 rounded-2xl p-8 border border-red-900/30 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to test your {guide.type} team?</h2>
          <p className="text-gray-400 mb-6">Use our free tool to see if your team has the perfect type coverage.</p>
          <Link 
            href="/" 
            className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg shadow-red-900/20"
          >
            Evaluate Your Team Now
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {guide.faq.map(item => (
              <div key={item.question} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h3 className="font-bold text-gray-200 mb-2">{item.question}</h3>
                <p className="text-gray-400 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-20 pt-8 border-t border-gray-800">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Related Guides</h3>
        <div className="flex flex-wrap gap-4">
          {guide.relatedLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-red-400 hover:text-red-300 text-sm">
              {link.title}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
