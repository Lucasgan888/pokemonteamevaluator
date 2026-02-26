import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Pokémon Team Evaluator",
  description: "Learn about Pokémon Team Evaluator, a free online Pokémon team strength and weakness analyzer.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-red">
      <h1 className="text-3xl font-bold text-red-500">About Pokémon Team Evaluator</h1>
      <p>
        Welcome to Pokémon Team Evaluator, a free online Pokémon team strength and weakness analyzer. This project was built to provide a fast, free,
        and easy-to-use tool that works entirely in your browser.
      </p>
      <h2>Our Mission</h2>
      <p>
        We believe great tools should be accessible to everyone. Pokémon Team Evaluator is completely free,
        requires no downloads or registration, and processes everything client-side for maximum
        privacy and speed.
      </p>
      <h2>Technology</h2>
      <p>
        Built with Next.js, React, and Tailwind CSS. All processing happens in your browser
        using modern web technologies. No data is ever sent to external servers.
      </p>
      <h2>Disclaimer</h2>
      <p>Pokémon is a trademark of Nintendo/Game Freak. This is a fan-made tool.</p>
    </div>
  );
}
