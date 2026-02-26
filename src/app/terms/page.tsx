import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Pokémon Team Evaluator",
  description: "Terms of service for Pokémon Team Evaluator.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-red">
      <h1 className="text-3xl font-bold text-red-500">Terms of Service</h1>
      <p>Last updated: February 2026</p>
      <h2>Acceptance of Terms</h2>
      <p>By accessing and using Pokémon Team Evaluator, you agree to these terms of service.</p>
      <h2>Description of Service</h2>
      <p>Pokémon Team Evaluator is a free online tool for entertainment and educational purposes. The service is provided &quot;as is&quot; without warranties of any kind.</p>
      <h2>User Conduct</h2>
      <p>You agree to use the service only for lawful purposes and in accordance with these terms.</p>
      <h2>Intellectual Property</h2>
      <p>Pokémon is a trademark of Nintendo/Game Freak. This is a fan-made tool. The website code and design are original works.</p>
      <h2>Limitation of Liability</h2>
      <p>We shall not be liable for any damages arising from the use of this service.</p>
      <h2>Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time.</p>
    </div>
  );
}
