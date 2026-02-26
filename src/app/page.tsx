"use client";

import { useState, useMemo } from "react";
import {
  TYPES,
  POKEMON_DB,
  TYPE_COLORS,
  analyzeTeam,
  type Pokemon,
  type PokemonType,
  type TeamAnalysis,
} from "@/lib/pokemon";

function TypeBadge({ type }: { type: PokemonType }) {
  return (
    <span className={`${TYPE_COLORS[type]} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
      {type}
    </span>
  );
}

function PokemonCard({ pokemon, onRemove }: { pokemon: Pokemon; onRemove: () => void }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex flex-col items-center gap-2 relative group">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>
      <span className="text-4xl">{pokemon.sprite}</span>
      <span className="font-semibold text-sm">{pokemon.name}</span>
      <div className="flex gap-1">
        {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
      </div>
    </div>
  );
}

function PokemonSearch({ onAdd, team }: { onAdd: (p: Pokemon) => void; team: Pokemon[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query) return POKEMON_DB.slice(0, 12);
    return POKEMON_DB.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.types.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const teamNames = new Set(team.map(p => p.name));

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search Pokémon by name or type..."
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-red-500 mb-3"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        {filtered.map(p => (
          <button
            key={p.name}
            onClick={() => onAdd(p)}
            disabled={teamNames.has(p.name) || team.length >= 6}
            className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition ${
              teamNames.has(p.name)
                ? "border-gray-800 bg-gray-900/50 text-gray-600 cursor-not-allowed"
                : "border-gray-700 hover:border-red-500 hover:bg-gray-800 cursor-pointer"
            }`}
          >
            <span className="text-xl">{p.sprite}</span>
            <div>
              <div className="font-medium text-xs">{p.name}</div>
              <div className="flex gap-1 mt-0.5">
                {p.types.map(t => (
                  <span key={t} className={`${TYPE_COLORS[t]} text-[10px] px-1 rounded text-white`}>{t}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AnalysisPanel({ analysis, team }: { analysis: TeamAnalysis; team: Pokemon[] }) {
  const shareText = `🏆 My Pokémon Team Score: ${analysis.score}/100\n\n${team.map(p => `${p.sprite} ${p.name} (${p.types.join("/")})`).join("\n")}\n\n⚠️ Weaknesses: ${analysis.sharedWeaknesses.join(", ") || "None!"}\n✅ Coverage gaps: ${analysis.uncoveredTypes.join(", ") || "Full coverage!"}\n\nBuild your team: https://pokemonteamevaluator.com`;

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="text-center py-6 bg-gradient-to-b from-red-950/40 to-transparent rounded-xl border border-red-900/50">
        <p className="text-red-400 text-sm mb-2">Team Rating</p>
        <p className={`text-6xl font-bold ${
          analysis.score >= 75 ? "text-green-400" :
          analysis.score >= 50 ? "text-yellow-400" :
          "text-red-400"
        }`}>
          {analysis.score}<span className="text-2xl text-gray-500">/100</span>
        </p>
        <button
          onClick={() => navigator.clipboard.writeText(shareText)}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm rounded-lg transition"
        >
          📋 Share Team
        </button>
      </div>

      {/* Warnings */}
      {analysis.sharedWeaknesses.length > 0 && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4">
          <h3 className="font-bold text-red-400 mb-2">⚠️ Shared Weaknesses</h3>
          <p className="text-sm text-gray-400 mb-2">3+ team members are weak to:</p>
          <div className="flex flex-wrap gap-2">
            {analysis.sharedWeaknesses.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}

      {analysis.uncoveredTypes.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4">
          <h3 className="font-bold text-amber-400 mb-2">🔓 Uncovered Types</h3>
          <p className="text-sm text-gray-400 mb-2">No team member hits super effective against:</p>
          <div className="flex flex-wrap gap-2">
            {analysis.uncoveredTypes.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}

      {analysis.immunities.length > 0 && (
        <div className="bg-green-950/30 border border-green-900/50 rounded-xl p-4">
          <h3 className="font-bold text-green-400 mb-2">🛡️ Immunities</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.immunities.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}

      {/* Type Coverage Grid */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="font-bold text-red-400 mb-3">📊 Defensive Matchup Chart</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TYPES.map(t => {
            const weak = analysis.defensiveWeaknesses[t];
            const resist = analysis.defensiveResistances[t];
            return (
              <div key={t} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <TypeBadge type={t} />
                <div className="flex gap-2 text-xs">
                  {weak > 0 && <span className="text-red-400">⬇{weak}</span>}
                  {resist > 0 && <span className="text-green-400">⬆{resist}</span>}
                  {weak === 0 && resist === 0 && <span className="text-gray-600">—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PokemonTeamEvaluator() {
  const [team, setTeam] = useState<Pokemon[]>([]);
  const analysis = useMemo(() => team.length > 0 ? analyzeTeam(team) : null, [team]);

  const addPokemon = (p: Pokemon) => {
    if (team.length < 6 && !team.find(t => t.name === p.name)) {
      setTeam([...team, p]);
    }
  };

  const removePokemon = (name: string) => {
    setTeam(team.filter(p => p.name !== name));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <p className="text-red-600 text-sm font-semibold tracking-wider mb-2">🔥 FREE ONLINE TOOL</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="text-red-500">Pokémon Team</span> Evaluator
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Build your Pokémon team and instantly analyze type coverage, weaknesses, and resistances.
          Get a team score and suggestions to build the perfect competitive team.
        </p>
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <span>✅ All 18 types</span>
          <span>✅ 100% free</span>
          <span>✅ Instant analysis</span>
        </div>
      </div>

      {/* Team Display */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Your Team ({team.length}/6)</h2>
        {team.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {team.map(p => (
              <PokemonCard key={p.name} pokemon={p} onRemove={() => removePokemon(p.name)} />
            ))}
            {Array.from({ length: 6 - team.length }).map((_, i) => (
              <div key={`empty-${i}`} className="border-2 border-dashed border-gray-800 rounded-xl p-4 flex items-center justify-center text-gray-700">
                <span className="text-2xl">+</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center text-gray-600">
            Add Pokémon below to start evaluating your team
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
        <h2 className="text-lg font-bold mb-3">Add Pokémon</h2>
        <PokemonSearch onAdd={addPokemon} team={team} />
      </div>

      {/* Ad placeholder */}
      <div className="mb-6 p-4 border border-dashed border-gray-700 rounded text-gray-600 text-xs text-center">
        Advertisement Space
      </div>

      {/* Analysis */}
      {analysis && <AnalysisPanel analysis={analysis} team={team} />}

      {/* SEO Content */}
      <section className="mt-16 prose prose-invert prose-red max-w-none">
        <h2 className="text-2xl font-bold text-red-500">What is the Pokémon Team Evaluator?</h2>
        <p>
          The Pokémon Team Evaluator is a free online tool that helps trainers analyze their Pokémon team&apos;s
          strengths, weaknesses, and type coverage. Whether you&apos;re building a team for competitive VGC battles,
          Smogon-tier matches, or just your playthrough, our evaluator gives you instant insights into how well
          your team is constructed.
        </p>
        <p>
          Our tool uses the complete Generation 9 type effectiveness chart, including all 18 types, immunities,
          and dual-type interactions. Simply add up to 6 Pokémon and get a comprehensive analysis showing which
          types your team can handle and where your vulnerabilities lie.
        </p>

        <h2 className="text-2xl font-bold text-red-500 mt-8">How to Use the Pokémon Team Evaluator</h2>
        <ol>
          <li><strong>Search for Pokémon</strong> — Use the search box to find Pokémon by name or type. Browse popular picks or search for specific team members.</li>
          <li><strong>Build Your Team</strong> — Click on a Pokémon to add it to your team. You can add up to 6 Pokémon, just like in the games.</li>
          <li><strong>View Analysis</strong> — Instantly see your team&apos;s score, shared weaknesses, uncovered types, and defensive matchup chart.</li>
          <li><strong>Optimize</strong> — Remove Pokémon that create overlapping weaknesses and add ones that fill coverage gaps.</li>
          <li><strong>Share Your Team</strong> — Copy your team composition and score to share with friends.</li>
        </ol>

        <h2 className="text-2xl font-bold text-red-500 mt-8">Understanding Your Team Score</h2>
        <ul>
          <li><strong>90-100:</strong> Excellent! Your team has great type coverage and minimal shared weaknesses.</li>
          <li><strong>70-89:</strong> Good. Your team is solid but has some gaps that could be exploited.</li>
          <li><strong>50-69:</strong> Average. Consider swapping some Pokémon to improve coverage.</li>
          <li><strong>Below 50:</strong> Needs work. Your team has significant weaknesses that opponents can target.</li>
        </ul>

        <h2 className="text-2xl font-bold text-red-500 mt-8">Tips for Building a Strong Pokémon Team</h2>
        <ul>
          <li><strong>Cover All Types</strong> — Aim for at least one super-effective option against every type.</li>
          <li><strong>Avoid Shared Weaknesses</strong> — If 3+ Pokémon share the same weakness, one move can sweep your team.</li>
          <li><strong>Include Immunities</strong> — Ghost-types are immune to Normal/Fighting, Ground-types to Electric, etc. These provide safe switches.</li>
          <li><strong>Balance Offense and Defense</strong> — Don&apos;t just focus on attacking power; defensive resistances matter too.</li>
          <li><strong>Consider Dual Types</strong> — Dual-type Pokémon provide more coverage per team slot.</li>
        </ul>

        <h2 className="text-2xl font-bold text-red-500 mt-8">Frequently Asked Questions</h2>

        <h3>Is the Pokémon Team Evaluator free?</h3>
        <p>Yes! It&apos;s completely free with no registration, downloads, or hidden fees required.</p>

        <h3>Which Pokémon games does this support?</h3>
        <p>The type chart is based on Generation 9 (Scarlet/Violet), which is compatible with all modern Pokémon games. The same type effectiveness system has been used since Generation 6.</p>

        <h3>Does this account for abilities and moves?</h3>
        <p>Currently the evaluator focuses on type-based analysis. Abilities like Levitate or moves with special type interactions are not factored in yet, but are planned for future updates.</p>

        <h3>Can I use this for competitive team building?</h3>
        <p>Absolutely! The type coverage analysis is essential for VGC, Smogon, and any competitive format. Use it alongside damage calculators for the best results.</p>

        <h3>How accurate is the type chart?</h3>
        <p>Our type chart includes all 18 types with correct super-effective, not-very-effective, and immunity matchups based on the official Pokémon type system.</p>

        <h3>Can I share my team with friends?</h3>
        <p>Yes! Click &quot;Share Team&quot; to copy your team composition and score to your clipboard for easy sharing on Discord, Reddit, or social media.</p>
      </section>
    </div>
  );
}
