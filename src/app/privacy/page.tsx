import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Pokémon Team Evaluator",
  description: "Privacy policy for Pokémon Team Evaluator.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-red">
      <h1 className="text-3xl font-bold text-red-500">Privacy Policy</h1>
      <p>Last updated: February 2026</p>
      <h2>Information We Collect</h2>
      <p>Pokémon Team Evaluator is a client-side application. All data is processed in your browser. We do not collect, store, or transmit any personal information.</p>
      <h2>Analytics</h2>
      <p>We may use privacy-friendly analytics (such as Google Analytics 4) to understand general usage patterns. No personally identifiable information is collected.</p>
      <h2>Cookies</h2>
      <p>We may use essential cookies to ensure the website functions properly. No tracking cookies are used.</p>
      <h2>Third-Party Services</h2>
      <p>We may display advertisements through third-party ad networks. These services may use their own cookies. Please refer to their respective privacy policies.</p>
      <h2>Contact</h2>
      <p>For privacy-related questions, please contact us through our website.</p>
    </div>
  );
}
