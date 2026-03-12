import { notFound } from "next/navigation";
import Link from "next/link";
import { GUIDE_ARTICLES } from "@/lib/content";

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDE_ARTICLES.find(g => g.slug === slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="text-red-500 hover:text-red-400 text-sm mb-8 inline-block">
        ← Back to Team Evaluator
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">{guide.title}</h1>
        <p className="text-xl text-gray-400 leading-relaxed">{guide.intro}</p>
      </div>

      <div className="space-y-12 mb-12">
        {guide.steps && (
          <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Action Steps</h2>
            <div className="space-y-4">
              {guide.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </span>
                  <p className="text-gray-300 mt-1">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {guide.sections.map(section => (
          <section key={section.title}>
            <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
            <div className="prose prose-invert max-w-none text-gray-400">
              {section.content}
            </div>
          </section>
        ))}

        <section className="bg-gradient-to-r from-red-950/40 to-transparent rounded-2xl p-8 border border-red-900/30 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Build Better Teams</h2>
            <p className="text-gray-400">Put these principles into practice using our free team analysis tool.</p>
          </div>
          <Link 
            href="/" 
            className="inline-block bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition whitespace-nowrap"
          >
            Start Evaluating
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-white">Common Questions</h2>
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
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">You Might Also Like</h3>
        <div className="flex flex-wrap gap-4">
          {guide.relatedLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-red-400 hover:text-red-300 text-sm font-medium">
              {link.title}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
