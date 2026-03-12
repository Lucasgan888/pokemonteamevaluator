# EVALUATOR_CONTENT_AUDIT.md

## Overview
This document audits the current capabilities of the `pokemonteamevaluator` engine to determine how it can be leveraged for the new "Type Guides" and "Strategy Guides".

## 1. Existing Data Structures (`src/lib/pokemon.ts`)
- **`TYPES`**: Full list of 18 types.
- **`POKEMON_DB`**: Contains ~40 popular Pokemon with names, types, and emojis.
- **Effectiveness Logic**: Hardcoded `E` (effectiveness), `SE` (super effective), `NVE` (not very effective), and `IMM` (immunity) tables.
- **`analyzeTeam(team)`**: 
  - Calculates `offensiveCoverage` (can hit a type for SE damage).
  - Calculates `defensiveWeaknesses` and `defensiveResistances` per type.
  - Identifies `uncoveredTypes` and `sharedWeaknesses` (3+ Pokemon).

## 2. Integration Opportunities

### Type Pages (`/types/[slug]`)
- **Offensive Snapshot**: Can be derived from `E[type]` values to list types it deals super-effective damage to.
- **Defensive Snapshot**: Derived from `E[any][type]` where result > 1 (weakness) or < 1 (resistance).
- **Good Partners**: Logic exists to check coverage; we can suggest Pokemon from `POKEMON_DB` that cover the current type's weaknesses.

### Guide Pages (`/guides/[slug]`)
- **Shared Weakness Guide**: Can reference the `sharedWeaknesses` array from the analysis result.
- **Coverage Guide**: Can reference the `uncoveredTypes` array.

## 3. SEO & H1 Audit
- Homepage H1: `Pokémon Team Evaluator`
- URL Structure: Currently just `/`. New routes will be `/types/*` and `/guides/*`.

## 4. Risks & Limitations
- **Gen 9 only**: The type chart is hardcoded for Gen 9.
- **No Items/Abilities**: Levitate, Sap Sipper, etc., are not currently factored into the logic.
- **Small Database**: `POKEMON_DB` is limited. Guides should focus on types rather than specific niche Pokemon not in the DB.
