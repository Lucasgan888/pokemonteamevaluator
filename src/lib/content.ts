import { PokemonType, TYPES } from "./pokemon";

export interface FAQ {
  question: string;
  answer: string;
}

export interface RelatedLink {
  title: string;
  href: string;
}

export interface ContentSection {
  title: string;
  content: string;
}

export interface BaseContent {
  title: string;
  slug: string;
  description: string;
  intro: string;
  sections: ContentSection[];
  faq: FAQ[];
  relatedLinks: RelatedLink[];
  updatedAt: string;
}

export interface TypeGuide extends BaseContent {
  type: PokemonType;
  strengths: string[];
  weaknesses: string[];
  recommendedPartners: string[];
  coverageTips: string;
}

export interface GuideArticle extends BaseContent {
  category: "shared-weaknesses" | "coverage" | "beginner-tips";
  steps?: string[];
}

// Type metadata for auto-generation
const TYPE_DATA: Record<PokemonType, { strengths: PokemonType[]; weaknesses: PokemonType[]; partners: string[]; tip: string }> = {
  Normal: { strengths: [], weaknesses: ["Fighting"], partners: ["Lucario", "Machamp"], tip: "Pair with Fighting types to handle Rock and Steel threats." },
  Fire: { strengths: ["Grass", "Ice", "Bug", "Steel"], weaknesses: ["Water", "Ground", "Rock"], partners: ["Garchomp", "Gyarados"], tip: "Pair with Ground or Water types to cover Rock and Water weaknesses." },
  Water: { strengths: ["Fire", "Ground", "Rock"], weaknesses: ["Electric", "Grass"], partners: ["Venusaur", "Dragonite"], tip: "Water types pair perfectly with Grass and Fire types to form a core." },
  Electric: { strengths: ["Water", "Flying"], weaknesses: ["Ground"], partners: ["Gliscor", "Garchomp"], tip: "Always pair with a Ground-immune Flying type to handle Ground attacks." },
  Grass: { strengths: ["Water", "Ground", "Rock"], weaknesses: ["Fire", "Ice", "Poison", "Flying", "Bug"], partners: ["Charizard", "Talonflame"], tip: "Grass has many weaknesses; pair with Fire or Steel types for balance." },
  Ice: { strengths: ["Grass", "Ground", "Flying", "Dragon"], weaknesses: ["Fire", "Fighting", "Rock", "Steel"], partners: ["Gyarados", "Togekiss"], tip: "Ice is fragile defensively; use it for offensive Dragon coverage." },
  Fighting: { strengths: ["Normal", "Ice", "Rock", "Dark", "Steel"], weaknesses: ["Flying", "Psychic", "Fairy"], partners: ["Scizor", "Metagross"], tip: "Fighting types excel at breaking walls; pair with Psychic counters." },
  Poison: { strengths: ["Grass", "Fairy"], weaknesses: ["Ground", "Psychic"], partners: ["Gliscor", "Espeon"], tip: "Poison is great for Fairy control; pair with Ground types." },
  Ground: { strengths: ["Fire", "Electric", "Poison", "Rock", "Steel"], weaknesses: ["Water", "Grass", "Ice"], partners: ["Ferrothorn", "Rotom-Wash"], tip: "Ground has excellent coverage; pair with Grass or Water types." },
  Flying: { strengths: ["Grass", "Fighting", "Bug"], weaknesses: ["Electric", "Ice", "Rock"], partners: ["Magnezone", "Steelix"], tip: "Flying types provide Ground immunity; pair with Electric or Rock counters." },
  Psychic: { strengths: ["Fighting", "Poison"], weaknesses: ["Bug", "Ghost", "Dark"], partners: ["Scizor", "Tyranitar"], tip: "Psychic types are vulnerable to Dark; always have a Dark counter." },
  Bug: { strengths: ["Grass", "Psychic", "Dark"], weaknesses: ["Fire", "Flying", "Rock"], partners: ["Tyranitar", "Steelix"], tip: "Bug types are fragile; use them for Psychic and Dark coverage." },
  Rock: { strengths: ["Fire", "Ice", "Flying", "Bug"], weaknesses: ["Water", "Grass", "Fighting", "Ground", "Steel"], partners: ["Gyarados", "Ferrothorn"], tip: "Rock has many weaknesses; pair with Water or Grass types." },
  Ghost: { strengths: ["Psychic", "Ghost"], weaknesses: ["Ghost", "Dark"], partners: ["Tyranitar", "Umbreon"], tip: "Ghost types provide Fighting immunity; pair with Dark counters." },
  Dragon: { strengths: ["Dragon"], weaknesses: ["Ice", "Dragon", "Fairy"], partners: ["Scizor", "Magnezone"], tip: "Dragon types are powerful but vulnerable to Fairy; always have Steel backup." },
  Dark: { strengths: ["Psychic", "Ghost"], weaknesses: ["Fighting", "Bug", "Fairy"], partners: ["Lucario", "Togekiss"], tip: "Dark types counter Psychic; pair with Fighting or Fairy counters." },
  Steel: { strengths: ["Ice", "Rock", "Fairy"], weaknesses: ["Fire", "Fighting", "Ground"], partners: ["Gyarados", "Gliscor"], tip: "Steel has excellent resistances; pair with Fire or Ground counters." },
  Fairy: { strengths: ["Fighting", "Dragon", "Dark"], weaknesses: ["Poison", "Steel"], partners: ["Lucario", "Excadrill"], tip: "Fairy types shut down Dragons; pair with Steel or Ground types." },
};

function generateTypeGuide(type: PokemonType): TypeGuide {
  const data = TYPE_DATA[type];
  const slug = type.toLowerCase();
  return {
    type,
    slug,
    title: `${type} Type Strategy & Team Building Guide`,
    description: `Master the ${type} type in your Pokemon team composition.`,
    intro: `${type} types offer unique strategic advantages in competitive battles.`,
    strengths: data.strengths,
    weaknesses: data.weaknesses,
    recommendedPartners: data.partners,
    coverageTips: data.tip,
    sections: [{ title: "Strategic Overview", content: `${type} types are essential for handling ${data.strengths.join(", ")} threats.` }],
    faq: [{ question: `What are the best partners for ${type} types?`, answer: `Consider ${data.partners.join(", ")} for optimal synergy.` }],
    relatedLinks: data.weaknesses.map(w => ({ title: `${w} Type Guide`, href: `/types/${w.toLowerCase()}` })),
    updatedAt: "2026-03-12"
  };
}

export const TYPE_GUIDES: TypeGuide[] = TYPES.map(generateTypeGuide);

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    category: "shared-weaknesses",
    slug: "how-to-fix-shared-team-weaknesses",
    title: "How to Fix Shared Team Weaknesses",
    description: "Learn how to identify and neutralize vulnerabilities that multiple team members share.",
    intro: "A shared weakness occurs when three or more Pokemon on your team are vulnerable to the same type. This is a common pitfall that can lead to a quick loss.",
    steps: [
      "Use the Team Evaluator to identify red flags.",
      "Look for types with 3+ red down arrows.",
      "Switch one Pokemon for a type that resists or is immune to that threat."
    ],
    sections: [
      { title: "Why Shared Weaknesses Matter", content: "If half your team is weak to Ground, a single Earthquake from your opponent can dismantle your entire strategy." }
    ],
    faq: [{ question: "What is an acceptable number of shared weaknesses?", answer: "Ideally, you should have no more than 2 Pokemon weak to any single type." }],
    relatedLinks: [{ title: "Type Matchup Chart", href: "/" }],
    updatedAt: "2024-03-12"
  },
  {
    category: "coverage",
    slug: "best-type-coverage-for-beginners",
    title: "Best Type Coverage for Beginners",
    description: "A simple guide to ensuring your team has the moves to hit any opponent super-effectively.",
    intro: "Offensive coverage ensures that you always have an answer for whatever your opponent sends out.",
    steps: [
      "Ensure you have STAB moves for all your Pokemon.",
      "Add coverage moves like Ice Beam or Thunderbolt to hit more types.",
      "Check the 'Uncovered Types' section of the Evaluator."
    ],
    sections: [
      { title: "The BoltBeam Strategy", content: "Electric and Ice moves together hit almost every Pokemon in the game for at least neutral damage." }
    ],
    faq: [{ question: "Should I focus on physical or special coverage?", answer: "A balanced team has both to avoid being walled by high-defense or high-special-defense opponents." }],
    relatedLinks: [{ title: "Evaluating Your Team", href: "/" }],
    updatedAt: "2024-03-12"
  }
];
