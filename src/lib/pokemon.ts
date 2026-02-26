// Pokemon Type System & Team Evaluation Engine

export const TYPES = [
  "Normal","Fire","Water","Electric","Grass","Ice",
  "Fighting","Poison","Ground","Flying","Psychic","Bug",
  "Rock","Ghost","Dragon","Dark","Steel","Fairy",
] as const;

export type PokemonType = typeof TYPES[number];

// Effectiveness chart: effectiveness[attacking][defending] = multiplier
const E: Record<string, Record<string, number>> = {};
TYPES.forEach(t => { E[t] = {}; TYPES.forEach(d => { E[t][d] = 1; }); });

// Super effective (2x)
const SE: [string, string[]][] = [
  ["Fire", ["Grass","Ice","Bug","Steel"]],
  ["Water", ["Fire","Ground","Rock"]],
  ["Electric", ["Water","Flying"]],
  ["Grass", ["Water","Ground","Rock"]],
  ["Ice", ["Grass","Ground","Flying","Dragon"]],
  ["Fighting", ["Normal","Ice","Rock","Dark","Steel"]],
  ["Poison", ["Grass","Fairy"]],
  ["Ground", ["Fire","Electric","Poison","Rock","Steel"]],
  ["Flying", ["Grass","Fighting","Bug"]],
  ["Psychic", ["Fighting","Poison"]],
  ["Bug", ["Grass","Psychic","Dark"]],
  ["Rock", ["Fire","Ice","Flying","Bug"]],
  ["Ghost", ["Psychic","Ghost"]],
  ["Dragon", ["Dragon"]],
  ["Dark", ["Psychic","Ghost"]],
  ["Steel", ["Ice","Rock","Fairy"]],
  ["Fairy", ["Fighting","Dragon","Dark"]],
];
SE.forEach(([atk, defs]) => defs.forEach(d => { E[atk][d] = 2; }));

// Not very effective (0.5x)
const NVE: [string, string[]][] = [
  ["Normal", ["Rock","Steel"]],
  ["Fire", ["Fire","Water","Rock","Dragon"]],
  ["Water", ["Water","Grass","Dragon"]],
  ["Electric", ["Electric","Grass","Dragon"]],
  ["Grass", ["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"]],
  ["Ice", ["Fire","Water","Ice","Steel"]],
  ["Fighting", ["Poison","Flying","Psychic","Bug","Fairy"]],
  ["Poison", ["Poison","Ground","Rock","Ghost"]],
  ["Ground", ["Grass","Bug"]],
  ["Flying", ["Electric","Rock","Steel"]],
  ["Psychic", ["Psychic","Steel"]],
  ["Bug", ["Fire","Fighting","Poison","Flying","Ghost","Steel","Fairy"]],
  ["Rock", ["Fighting","Ground","Steel"]],
  ["Ghost", ["Dark"]],
  ["Dragon", ["Steel"]],
  ["Dark", ["Fighting","Dark","Fairy"]],
  ["Steel", ["Fire","Water","Electric","Steel"]],
  ["Fairy", ["Fire","Poison","Steel"]],
];
NVE.forEach(([atk, defs]) => defs.forEach(d => { E[atk][d] = 0.5; }));

// Immunities (0x)
const IMM: [string, string[]][] = [
  ["Normal", ["Ghost"]],
  ["Electric", ["Ground"]],
  ["Fighting", ["Ghost"]],
  ["Poison", ["Steel"]],
  ["Ground", ["Flying"]],
  ["Psychic", ["Dark"]],
  ["Ghost", ["Normal"]],
  ["Dragon", ["Fairy"]],
];
IMM.forEach(([atk, defs]) => defs.forEach(d => { E[atk][d] = 0; }));

export function getEffectiveness(atkType: PokemonType, defTypes: PokemonType[]): number {
  return defTypes.reduce((mult, dt) => mult * (E[atkType]?.[dt] ?? 1), 1);
}

export interface Pokemon {
  name: string;
  types: PokemonType[];
  sprite: string;
}

export interface TeamAnalysis {
  offensiveCoverage: Record<PokemonType, boolean>; // can hit SE
  defensiveWeaknesses: Record<PokemonType, number>; // count of weak members
  defensiveResistances: Record<PokemonType, number>;
  uncoveredTypes: PokemonType[]; // types no team member hits SE
  sharedWeaknesses: PokemonType[]; // types 3+ members weak to
  immunities: PokemonType[];
  score: number; // 0-100
}

export function getDefensiveMultiplier(atkType: PokemonType, defTypes: PokemonType[]): number {
  return defTypes.reduce((mult, dt) => mult * (E[atkType]?.[dt] ?? 1), 1);
}

export function analyzeTeam(team: Pokemon[]): TeamAnalysis {
  const offensiveCoverage: Record<string, boolean> = {};
  const defensiveWeaknesses: Record<string, number> = {};
  const defensiveResistances: Record<string, number> = {};

  TYPES.forEach(t => {
    offensiveCoverage[t] = false;
    defensiveWeaknesses[t] = 0;
    defensiveResistances[t] = 0;
  });

  // Offensive: can any team member's STAB hit this type SE?
  for (const poke of team) {
    for (const atkType of poke.types) {
      for (const defType of TYPES) {
        if (E[atkType]?.[defType] === 2) {
          offensiveCoverage[defType] = true;
        }
      }
    }
  }

  // Defensive: how many team members are weak/resistant to each type
  for (const poke of team) {
    for (const atkType of TYPES) {
      const mult = getDefensiveMultiplier(atkType, poke.types);
      if (mult > 1) defensiveWeaknesses[atkType]++;
      if (mult < 1) defensiveResistances[atkType]++;
    }
  }

  const uncoveredTypes = TYPES.filter(t => !offensiveCoverage[t]);
  const sharedWeaknesses = TYPES.filter(t => defensiveWeaknesses[t] >= 3);
  const immunities = TYPES.filter(t =>
    team.some(p => getDefensiveMultiplier(t, p.types) === 0)
  );

  // Score calculation
  const coverageScore = ((TYPES.length - uncoveredTypes.length) / TYPES.length) * 40;
  const weaknessScore = Math.max(0, 30 - sharedWeaknesses.length * 10);
  const immunityScore = Math.min(20, immunities.length * 5);
  const balanceScore = team.length >= 6 ? 10 : (team.length / 6) * 10;
  const score = Math.round(coverageScore + weaknessScore + immunityScore + balanceScore);

  return {
    offensiveCoverage: offensiveCoverage as Record<PokemonType, boolean>,
    defensiveWeaknesses: defensiveWeaknesses as Record<PokemonType, number>,
    defensiveResistances: defensiveResistances as Record<PokemonType, number>,
    uncoveredTypes,
    sharedWeaknesses,
    immunities,
    score,
  };
}

// Popular Pokemon database (subset for MVP)
export const POKEMON_DB: Pokemon[] = [
  { name: "Charizard", types: ["Fire", "Flying"], sprite: "🔥" },
  { name: "Blastoise", types: ["Water"], sprite: "💧" },
  { name: "Venusaur", types: ["Grass", "Poison"], sprite: "🌿" },
  { name: "Pikachu", types: ["Electric"], sprite: "⚡" },
  { name: "Gengar", types: ["Ghost", "Poison"], sprite: "👻" },
  { name: "Dragonite", types: ["Dragon", "Flying"], sprite: "🐉" },
  { name: "Mewtwo", types: ["Psychic"], sprite: "🧠" },
  { name: "Tyranitar", types: ["Rock", "Dark"], sprite: "🪨" },
  { name: "Garchomp", types: ["Dragon", "Ground"], sprite: "🦈" },
  { name: "Lucario", types: ["Fighting", "Steel"], sprite: "⚔️" },
  { name: "Togekiss", types: ["Fairy", "Flying"], sprite: "🧚" },
  { name: "Scizor", types: ["Bug", "Steel"], sprite: "✂️" },
  { name: "Gyarados", types: ["Water", "Flying"], sprite: "🌊" },
  { name: "Snorlax", types: ["Normal"], sprite: "😴" },
  { name: "Alakazam", types: ["Psychic"], sprite: "🔮" },
  { name: "Machamp", types: ["Fighting"], sprite: "💪" },
  { name: "Steelix", types: ["Steel", "Ground"], sprite: "🔩" },
  { name: "Espeon", types: ["Psychic"], sprite: "☀️" },
  { name: "Umbreon", types: ["Dark"], sprite: "🌙" },
  { name: "Salamence", types: ["Dragon", "Flying"], sprite: "🐲" },
  { name: "Metagross", types: ["Steel", "Psychic"], sprite: "🤖" },
  { name: "Infernape", types: ["Fire", "Fighting"], sprite: "🐵" },
  { name: "Luxray", types: ["Electric"], sprite: "🦁" },
  { name: "Roserade", types: ["Grass", "Poison"], sprite: "🌹" },
  { name: "Weavile", types: ["Dark", "Ice"], sprite: "❄️" },
  { name: "Gliscor", types: ["Ground", "Flying"], sprite: "🦂" },
  { name: "Haxorus", types: ["Dragon"], sprite: "🪓" },
  { name: "Volcarona", types: ["Bug", "Fire"], sprite: "🦋" },
  { name: "Hydreigon", types: ["Dark", "Dragon"], sprite: "🐍" },
  { name: "Aegislash", types: ["Steel", "Ghost"], sprite: "🛡️" },
  { name: "Greninja", types: ["Water", "Dark"], sprite: "🥷" },
  { name: "Talonflame", types: ["Fire", "Flying"], sprite: "🦅" },
  { name: "Sylveon", types: ["Fairy"], sprite: "🎀" },
  { name: "Mimikyu", types: ["Ghost", "Fairy"], sprite: "🎭" },
  { name: "Dragapult", types: ["Dragon", "Ghost"], sprite: "🚀" },
  { name: "Corviknight", types: ["Flying", "Steel"], sprite: "🐦‍⬛" },
  { name: "Excadrill", types: ["Ground", "Steel"], sprite: "⛏️" },
  { name: "Ferrothorn", types: ["Grass", "Steel"], sprite: "🌵" },
  { name: "Rotom-Wash", types: ["Electric", "Water"], sprite: "🫧" },
  { name: "Magnezone", types: ["Electric", "Steel"], sprite: "🧲" },
];

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: "bg-gray-500",
  Fire: "bg-red-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-500",
  Grass: "bg-green-500",
  Ice: "bg-cyan-400",
  Fighting: "bg-orange-700",
  Poison: "bg-purple-500",
  Ground: "bg-amber-700",
  Flying: "bg-indigo-400",
  Psychic: "bg-pink-500",
  Bug: "bg-lime-600",
  Rock: "bg-yellow-800",
  Ghost: "bg-purple-800",
  Dragon: "bg-violet-700",
  Dark: "bg-gray-800",
  Steel: "bg-slate-500",
  Fairy: "bg-pink-400",
};
