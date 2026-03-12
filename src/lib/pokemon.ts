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
  id: number;
  generation: number;
  spriteUrl?: string;
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

// Pre-computed SE targets for performance optimization
const SE_TARGETS: Record<PokemonType, PokemonType[]> = {
  Normal: [],
  Fire: ["Grass", "Ice", "Bug", "Steel"],
  Water: ["Fire", "Ground", "Rock"],
  Electric: ["Water", "Flying"],
  Grass: ["Water", "Ground", "Rock"],
  Ice: ["Grass", "Ground", "Flying", "Dragon"],
  Fighting: ["Normal", "Ice", "Rock", "Dark", "Steel"],
  Poison: ["Grass", "Fairy"],
  Ground: ["Fire", "Electric", "Poison", "Rock", "Steel"],
  Flying: ["Grass", "Fighting", "Bug"],
  Psychic: ["Fighting", "Poison"],
  Bug: ["Grass", "Psychic", "Dark"],
  Rock: ["Fire", "Ice", "Flying", "Bug"],
  Ghost: ["Psychic", "Ghost"],
  Dragon: ["Dragon"],
  Dark: ["Psychic", "Ghost"],
  Steel: ["Ice", "Rock", "Fairy"],
  Fairy: ["Fighting", "Dragon", "Dark"],
};

export function analyzeTeam(team: Pokemon[]): TeamAnalysis {
  const offensiveCoverage: Record<string, boolean> = {};
  const defensiveWeaknesses: Record<string, number> = {};
  const defensiveResistances: Record<string, number> = {};

  TYPES.forEach(t => {
    offensiveCoverage[t] = false;
    defensiveWeaknesses[t] = 0;
    defensiveResistances[t] = 0;
  });

  // Offensive: can any team member's STAB hit this type SE? (optimized with lookup table)
  for (const poke of team) {
    for (const atkType of poke.types) {
      SE_TARGETS[atkType].forEach(defType => {
        offensiveCoverage[defType] = true;
      });
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

  // Improved score calculation with better curves
  const coverageRatio = (TYPES.length - uncoveredTypes.length) / TYPES.length;
  const coverageScore = Math.pow(coverageRatio, 1.5) * 35;
  const weaknessScore = Math.max(0, 35 - sharedWeaknesses.length * 8 - (sharedWeaknesses.length > 2 ? 10 : 0));
  const immunityScore = Math.min(15, immunities.length * 4);
  const balanceScore = team.length >= 6 ? 15 : 0;
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
  { name: "Charizard", types: ["Fire", "Flying"], sprite: "🔥", id: 6, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
  { name: "Blastoise", types: ["Water"], sprite: "💧", id: 9, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
  { name: "Venusaur", types: ["Grass", "Poison"], sprite: "🌿", id: 3, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
  { name: "Pikachu", types: ["Electric"], sprite: "⚡", id: 25, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  { name: "Gengar", types: ["Ghost", "Poison"], sprite: "👻", id: 94, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" },
  { name: "Dragonite", types: ["Dragon", "Flying"], sprite: "🐉", id: 149, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png" },
  { name: "Mewtwo", types: ["Psychic"], sprite: "🧠", id: 150, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" },
  { name: "Tyranitar", types: ["Rock", "Dark"], sprite: "🪨", id: 248, generation: 2, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png" },
  { name: "Garchomp", types: ["Dragon", "Ground"], sprite: "🦈", id: 445, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png" },
  { name: "Lucario", types: ["Fighting", "Steel"], sprite: "⚔️", id: 448, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" },
  { name: "Togekiss", types: ["Fairy", "Flying"], sprite: "🧚", id: 468, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/468.png" },
  { name: "Scizor", types: ["Bug", "Steel"], sprite: "✂️", id: 212, generation: 2, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png" },
  { name: "Gyarados", types: ["Water", "Flying"], sprite: "🌊", id: 130, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" },
  { name: "Snorlax", types: ["Normal"], sprite: "😴", id: 143, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
  { name: "Alakazam", types: ["Psychic"], sprite: "🔮", id: 65, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png" },
  { name: "Machamp", types: ["Fighting"], sprite: "💪", id: 68, generation: 1, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png" },
  { name: "Steelix", types: ["Steel", "Ground"], sprite: "🔩", id: 208, generation: 2, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/208.png" },
  { name: "Espeon", types: ["Psychic"], sprite: "☀️", id: 196, generation: 2, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png" },
  { name: "Umbreon", types: ["Dark"], sprite: "🌙", id: 197, generation: 2, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png" },
  { name: "Salamence", types: ["Dragon", "Flying"], sprite: "🐲", id: 373, generation: 3, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/373.png" },
  { name: "Metagross", types: ["Steel", "Psychic"], sprite: "🤖", id: 376, generation: 3, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/376.png" },
  { name: "Infernape", types: ["Fire", "Fighting"], sprite: "🐵", id: 392, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png" },
  { name: "Luxray", types: ["Electric"], sprite: "🦁", id: 405, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/405.png" },
  { name: "Roserade", types: ["Grass", "Poison"], sprite: "🌹", id: 407, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/407.png" },
  { name: "Weavile", types: ["Dark", "Ice"], sprite: "❄️", id: 461, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png" },
  { name: "Gliscor", types: ["Ground", "Flying"], sprite: "🦂", id: 472, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/472.png" },
  { name: "Haxorus", types: ["Dragon"], sprite: "🪓", id: 612, generation: 5, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/612.png" },
  { name: "Volcarona", types: ["Bug", "Fire"], sprite: "🦋", id: 637, generation: 5, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/637.png" },
  { name: "Hydreigon", types: ["Dark", "Dragon"], sprite: "🐍", id: 635, generation: 5, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/635.png" },
  { name: "Aegislash", types: ["Steel", "Ghost"], sprite: "🛡️", id: 681, generation: 6, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/681.png" },
  { name: "Greninja", types: ["Water", "Dark"], sprite: "🥷", id: 658, generation: 6, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png" },
  { name: "Talonflame", types: ["Fire", "Flying"], sprite: "🦅", id: 663, generation: 6, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/663.png" },
  { name: "Sylveon", types: ["Fairy"], sprite: "🎀", id: 700, generation: 6, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png" },
  { name: "Mimikyu", types: ["Ghost", "Fairy"], sprite: "🎭", id: 778, generation: 7, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/778.png" },
  { name: "Dragapult", types: ["Dragon", "Ghost"], sprite: "🚀", id: 887, generation: 8, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/887.png" },
  { name: "Corviknight", types: ["Flying", "Steel"], sprite: "🐦‍⬛", id: 823, generation: 8, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/823.png" },
  { name: "Excadrill", types: ["Ground", "Steel"], sprite: "⛏️", id: 530, generation: 5, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/530.png" },
  { name: "Ferrothorn", types: ["Grass", "Steel"], sprite: "🌵", id: 598, generation: 5, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/598.png" },
  { name: "Rotom-Wash", types: ["Electric", "Water"], sprite: "🫧", id: 479, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/479.png" },
  { name: "Magnezone", types: ["Electric", "Steel"], sprite: "🧲", id: 462, generation: 4, spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/462.png" },
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
