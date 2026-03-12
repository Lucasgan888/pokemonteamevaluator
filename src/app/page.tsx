"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';

import {
  TYPES,
  POKEMON_DB,
  TYPE_COLORS,
  analyzeTeam,
  type Pokemon,
  type PokemonType,
  type TeamAnalysis,
} from "@/lib/pokemon";
import PokemonImage from "@/components/PokemonImage";
import DraggablePokemon from "@/components/DraggablePokemon";
import SortablePokemon from "@/components/SortablePokemon";

function TypeBadge({ type, linkable = false }: { type: PokemonType; linkable?: boolean }) {
  const badge = (
    <span className={`${TYPE_COLORS[type]} type-chip`}>
      {type}
    </span>
  );

  if (linkable) {
    return (
      <Link href={`/types/${type.toLowerCase()}`} className="hover:scale-110 transition-transform inline-block">
        {badge}
      </Link>
    );
  }

  return badge;
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
        placeholder="Search for a Pokemon (e.g. Charizard, Water)..."
        className="w-full bg-slate-950 border border-panel-border rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-accent mb-4 transition-colors"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map(p => (
          <DraggablePokemon 
            key={p.name} 
            pokemon={p} 
            disabled={teamNames.has(p.name) || team.length >= 6} 
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}

function AnalysisPanel({ analysis, team }: { analysis: TeamAnalysis; team: Pokemon[] }) {
  const [toast, setToast] = useState("");
  const shareText = `🏆 My Pokémon Team Score: ${analysis.score}/100\n\n${team.map(p => `${p.sprite} ${p.name} (${p.types.join("/")})`).join("\n")}\n\n⚠️ Weaknesses: ${analysis.sharedWeaknesses.join(", ") || "None!"}\n✅ Coverage gaps: ${analysis.uncoveredTypes.join(", ") || "Full coverage!"}\n\nBuild your team: https://pokemonteamevaluator.com`;

  const radarData = [
    { subject: 'Coverage', A: analysis.score > 0 ? Math.min(100, (1 - analysis.uncoveredTypes.length / 18) * 100) : 0 },
    { subject: 'Defense', A: analysis.score > 0 ? Math.min(100, (1 - analysis.sharedWeaknesses.length / 18) * 100) : 0 },
    { subject: 'Immunities', A: Math.min(100, (analysis.immunities.length / 6) * 100) },
    { subject: 'Balance', A: analysis.score },
    { subject: 'Synergy', A: analysis.score > 50 ? analysis.score : 50 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 text-center py-10 lab-card bg-linear-to-b from-accent/5 to-transparent border-accent/20 flex flex-col justify-center">
          <p className="text-accent text-xs font-black uppercase tracking-widest mb-2">Analysis Complete</p>
          <p className="text-sm text-slate-400 mb-1">Your Team Strategy Score</p>
          <div className={`text-7xl font-black ${
            analysis.score >= 75 ? "text-emerald-400" :
            analysis.score >= 50 ? "text-amber-400" :
            "text-rose-500"
          }`}>
            {analysis.score}<span className="text-2xl text-slate-600 font-medium">/100</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareText);
              setToast("Team analysis copied!");
              setTimeout(() => setToast(""), 3000);
            }}
            className="mt-6 lab-button mx-auto"
          >
            Share Report
          </button>
        </div>

        <div className="lg:col-span-2 lab-card p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Team Performance Radar</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <Radar
                  name="Team"
                  dataKey="A"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-accent text-slate-900 px-6 py-3 rounded-lg font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warnings */}
        {analysis.sharedWeaknesses.length > 0 && (
          <div className="lab-card p-6 border-rose-500/20 bg-rose-500/5">
            <h3 className="font-black text-rose-400 mb-2 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Critical Vulnerabilities
            </h3>
            <p className="text-xs text-slate-500 mb-4">Multiple members are weak to these types:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.sharedWeaknesses.map(t => <TypeBadge key={t} type={t} linkable />)}
            </div>
          </div>
        )}

        {analysis.uncoveredTypes.length > 0 && (
          <div className="lab-card p-6 border-amber-500/20 bg-amber-500/5">
            <h3 className="font-black text-amber-400 mb-2 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Coverage Gaps
            </h3>
            <p className="text-xs text-slate-500 mb-4">No team member deals super-effective damage to:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.uncoveredTypes.map(t => <TypeBadge key={t} type={t} linkable />)}
            </div>
          </div>
        )}
      </div>

      {analysis.immunities.length > 0 && (
        <div className="lab-card p-6 border-emerald-500/20 bg-emerald-500/5">
          <h3 className="font-black text-emerald-400 mb-4 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Switch-in Immunities
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.immunities.map(t => <TypeBadge key={t} type={t} linkable />)}
          </div>
        </div>
      )}

      {/* Type Coverage Matrix Heatmap */}
      <div className="lab-card p-6 overflow-hidden">
        <h3 className="font-black text-accent mb-6 uppercase tracking-widest text-sm text-center">Defensive Structural Analysis</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
          {TYPES.map(t => {
            const weak = analysis.defensiveWeaknesses[t];
            const resist = analysis.defensiveResistances[t];
            const diff = resist - weak;
            
            let bgColor = "bg-slate-900/50";
            let borderColor = "border-slate-800";
            if (diff < 0) {
              bgColor = diff <= -1 ? (diff <= -2 ? "bg-rose-500/30" : "bg-rose-500/10") : "bg-slate-900/50";
              borderColor = diff <= -1 ? (diff <= -2 ? "border-rose-500/50" : "border-rose-500/30") : "border-slate-800";
            } else if (diff > 0) {
              bgColor = diff >= 1 ? (diff >= 2 ? "bg-emerald-500/30" : "bg-emerald-500/10") : "bg-slate-900/50";
              borderColor = diff >= 1 ? (diff >= 2 ? "border-emerald-500/50" : "border-emerald-500/30") : "border-slate-800";
            }

            return (
              <div 
                key={t} 
                className={`flex flex-col items-center gap-2 rounded-lg p-3 border transition-all hover:scale-105 ${bgColor} ${borderColor}`}
              >
                <TypeBadge type={t} />
                <div className="flex flex-col items-center">
                  <span className={`text-lg font-black ${
                    diff < 0 ? "text-rose-400" : diff > 0 ? "text-emerald-400" : "text-slate-500"
                  }`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                  <div className="flex gap-2 text-[10px] font-bold opacity-60">
                    <span className="text-rose-500">W:{weak}</span>
                    <span className="text-emerald-400">R:{resist}</span>
                  </div>
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activePokemon, setActivePokemon] = useState<Pokemon | null>(null);
  const [isPending, startTransition] = useTransition();
  const analysis = useMemo(() => team.length > 0 ? analyzeTeam(team) : null, [team]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addPokemon = (p: Pokemon) => {
    if (team.length < 6 && !team.find(t => t.name === p.name)) {
      setTeam([...team, p]);
    }
  };

  const removePokemon = (name: string) => {
    setTeam(team.filter(p => p.name !== name));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActivePokemon(active.data.current?.pokemon);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActivePokemon(null);

    if (!over) return;

    // Handle dropping search item onto team area
    if (active.data.current?.type === 'search-item') {
      addPokemon(active.data.current.pokemon);
      return;
    }

    // Handle reordering within team
    if (active.id !== over.id && active.data.current?.type === 'team-item') {
      const oldIndex = team.findIndex((p) => `team-${p.name}` === active.id);
      const newIndex = team.findIndex((p) => `team-${p.name}` === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setTeam((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          {/* Hero & Tool Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-accent text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-accent" />
                  Pokemon Team Evaluator - VGC & Singles
                </p>
                <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tighter mb-6">
                  POKEMON TEAM <span className="text-accent underline decoration-accent/30 underline-offset-8">EVALUATOR</span>
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed font-medium">
                  The precision pokemonteamevaluator tool for competitive trainers. Analyze your coverage, identify fatal flaws, and build a mathematically superior team with pokemonteamevaluator.
                </p>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="text-accent text-xl font-bold">/01</span> 
                  <span>Full Gen 9 type effectiveness engine.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="text-accent text-xl font-bold">/02</span>
                  <span>Offensive & Defensive matrix calculations.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="text-accent text-xl font-bold">/03</span>
                  <span>Shared weakness & resistance detection.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="lab-card p-6 bg-slate-900/40 border-accent/10">
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex justify-between">
                  Current Roster <span>{team.length} / 06</span>
                </h2>
                
                <SortableContext 
                  items={team.map(p => `team-${p.name}`)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8 min-h-[160px]">
                    {team.map(p => (
                      <SortablePokemon 
                        key={p.name} 
                        pokemon={p} 
                        onRemove={() => removePokemon(p.name)} 
                      />
                    ))}
                    {Array.from({ length: 6 - team.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="lab-card bg-slate-950/50 border-dashed border-slate-800 p-4 flex items-center justify-center text-slate-800/30 hover:border-slate-700 transition-colors">
                        <span className="text-xl font-black">+</span>
                      </div>
                    ))}
                  </div>
                </SortableContext>

                <div className="space-y-4">
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Add Team Member</h2>
                  <PokemonSearch onAdd={addPokemon} team={team} />
                </div>
              </div>
            </div>
          </div>

{analysis && (
            <div className="mb-24 scroll-mt-10" id="analysis">
              <AnalysisPanel analysis={analysis} team={team} />
            </div>
          )}

          {/* Content Discovery Sections */}
          <div className="space-y-24">
            <section>
              <div className="flex items-end justify-between mb-8 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Popular Type Guides</h2>
                  <p className="text-slate-500 font-medium text-sm">Deep-dive into individual type strategies and matchups.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/types/fire" className="lab-card p-6 hover:border-accent group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-sm">FIRE</span>
                    <span className="text-slate-700 font-bold group-hover:text-accent tracking-tighter transition-colors">01</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Fire Type Strategy</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Offensive powerhouse guide. Learn to break through Steel-types.</p>
                </Link>
                <Link href="/types/water" className="lab-card p-6 hover:border-accent group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-sm">WATER</span>
                    <span className="text-slate-700 font-bold group-hover:text-accent tracking-tighter transition-colors">02</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Water Type Utility</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">The ultimate defensive anchor. Balancing the Fire-Water-Grass core.</p>
                </Link>
                <Link href="/types/fairy" className="lab-card p-6 hover:border-accent group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-pink-400 text-white text-[10px] font-black px-2 py-0.5 rounded-sm">FAIRY</span>
                    <span className="text-slate-700 font-bold group-hover:text-accent tracking-tighter transition-colors">03</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Fairy Control</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Shutting down Dragon-types. Essential Fairy-type coverage tips.</p>
                </Link>
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between mb-8 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Tactical Building Guides</h2>
                  <p className="text-slate-500 font-medium text-sm">Step-by-step check-lists to improve your roster.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/guides/how-to-fix-shared-team-weaknesses" className="lab-card p-8 hover:border-accent group overflow-hidden relative">
                  <div className="relative z-10 text-xs font-black text-accent mb-4 uppercase tracking-[0.2em]">Strategy Note</div>
                  <h3 className="text-2xl font-black mb-4 relative z-10">How to Fix Shared Team Weaknesses</h3>
                  <p className="text-slate-400 leading-relaxed relative z-10 max-w-md">Is your team getting swept by a single Ground-type? Here is how to swap members without breaking balance.</p>
                  <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-8xl font-black italic">!</span>
                  </div>
                </Link>
                <Link href="/guides/best-type-coverage-for-beginners" className="lab-card p-8 hover:border-accent group overflow-hidden relative">
                  <div className="relative z-10 text-xs font-black text-accent mb-4 uppercase tracking-[0.2em]">Beginner Guide</div>
                  <h3 className="text-2xl font-black mb-4 relative z-10">Perfect Coverage for Beginners</h3>
                  <p className="text-slate-400 leading-relaxed relative z-10 max-w-md">Ensuring you can hit every type super-effectively. The simplest way to win more battles.</p>
                  <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-8xl font-black italic">?</span>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* SEO / FAQ Section */}
          <section className="mt-40 pt-20 border-t border-slate-800">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter mb-12 italic text-center uppercase">The Pokemonteamevaluator Theory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="lab-card p-8 bg-slate-900/30">
                  <h3 className="text-xl font-bold text-accent mb-4 italic uppercase">1. Why use Pokemonteamevaluator?</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    The competitive meta in Gen 9 is more complex than ever. With 18 distinct types and hundreds of viable moves, your team coordination is critical. Using **pokemonteamevaluator** allows you to visualize your defensive structural integrity and offensive ceiling before entering the arena. Our **pokemonteamevaluator** engine processes complex type charts to give you a definitive advantage in high-stakes battles.
                  </p>
                </div>
                <div className="lab-card p-8 bg-slate-900/30">
                  <h3 className="text-xl font-bold text-accent mb-4 italic uppercase">2. The Pokemonteamevaluator Score</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Every squad entered into the **pokemonteamevaluator** interface receives a real-time score. This **pokemonteamevaluator** metric isn't just a random number; it's a weighted calculation of coverage gaps, switch-in immunities, and vulnerability overlaps. A high **pokemonteamevaluator** score means your team has low shared weaknesses and high resilience.
                  </p>
                </div>
              </div>

              <div className="space-y-16 max-w-3xl mx-auto">
                <div>
                  <h3 className="text-xl font-bold text-accent mb-4 italic uppercase">What is the Pokemonteamevaluator exactly?</h3>
                  <p className="text-slate-400 leading-relaxed">
                    The **pokemonteamevaluator** is a free online tool designed for competitive trainers to analyze their team's strengths, weaknesses, and type coverage. Whether you are building a team for VGC battles, Smogon-tier matches, or your main story playthrough, our **pokemonteamevaluator** provides instant mathematical insights to ensure your strategy is bulletproof. Use **pokemonteamevaluator** to identify shared weaknesses, optimize offensive coverage, and calculate your team's defensive balance score.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-accent mb-4 italic uppercase">How to Optimize Your Roster with Pokemonteamevaluator</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Success in high-level battles requires the kind of precision that only **pokemonteamevaluator** can provide. The **pokemonteamevaluator** helps you achieve this by highlighting critical flaws in your coverage. Using the **pokemonteamevaluator** dashboard is intentionally simple for pro-level results:
                  </p>
                  <ol className="list-none space-y-6 text-slate-400 font-medium">
                    <li className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black flex-shrink-0">1</span>
                      <div>
                        <strong className="text-slate-200 block mb-1 uppercase tracking-tight italic">Search and Add</strong>
                        Find your core members using our **pokemonteamevaluator** search engine. Add them to your battle board instantly.
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black flex-shrink-0">2</span>
                      <div>
                        <strong className="text-slate-200 block mb-1 uppercase tracking-tight italic">Evaluate Strategy</strong>
                        Review the **pokemonteamevaluator** radar chart to see your team's overall balance across five key strategic dimensions.
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black flex-shrink-0">3</span>
                      <div>
                        <strong className="text-slate-200 block mb-1 uppercase tracking-tight italic">Iron Out Vulnerabilities</strong>
                        The **pokemonteamevaluator** matrix results will show you exactly which types can sweep your entire team. Use this data to swap members until your **pokemonteamevaluator** score improves.
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div className="pt-10 border-t border-slate-800/50">
                  <p className="text-sm text-slate-500 leading-relaxed italic text-center">
                    Trainers worldwide rely on **pokemonteamevaluator** data to refine their competitive strategies. Don't leave your victory to chance—verify your build with **pokemonteamevaluator** today. Our mission at **pokemonteamevaluator** is to provide the most accurate Gen 9 analysis available for free.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="bg-slate-950/80 border-t border-slate-800 py-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-black tracking-tighter mb-1 uppercase">POKEMON TEAM EVALUATOR</h2>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Precision Analysis Utility // Gen 9</p>
            </div>
            <div className="flex gap-8 text-xs font-black text-slate-500 uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
              <Link href="/about" className="hover:text-accent transition-colors">Source</Link>
            </div>
          </div>
        </footer>

        {typeof document !== 'undefined' && createPortal(
          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.4',
                },
              },
            }),
          }}>
            {activePokemon ? (
              <div className={`lab-card p-4 flex flex-col items-center gap-2 border-accent bg-slate-800 shadow-2xl scale-105 pointer-events-none ${
                activeId?.startsWith('search') ? 'w-48' : 'w-32'
              }`}>
                <PokemonImage 
                  spriteUrl={activePokemon.spriteUrl} 
                  emoji={activePokemon.sprite} 
                  name={activePokemon.name} 
                  size={activeId?.startsWith('search') ? 48 : 80}
                />
                <span className="font-bold text-sm text-slate-200 mt-2">{activePokemon.name}</span>
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
}
