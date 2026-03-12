'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Pokemon, TYPE_COLORS } from '@/lib/pokemon';
import PokemonImage from './PokemonImage';

interface DraggablePokemonProps {
  pokemon: Pokemon;
  disabled?: boolean;
  onAdd?: (p: Pokemon) => void;
}

export default function DraggablePokemon({ pokemon, disabled, onAdd }: DraggablePokemonProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `search-${pokemon.name}`,
    data: {
      type: 'search-item',
      pokemon,
    },
    disabled,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !disabled && onAdd && onAdd(pokemon)}
      className={`flex items-center gap-3 p-2 rounded-lg border text-left text-sm transition-all touch-none ${
        disabled
          ? "border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed"
          : isDragging
          ? "border-accent bg-slate-800/80 z-50 opacity-50"
          : "border-slate-700 hover:border-accent hover:bg-slate-800/50 cursor-pointer shadow-sm active:scale-95"
      }`}
    >
      <PokemonImage 
        spriteUrl={pokemon.spriteUrl} 
        emoji={pokemon.sprite} 
        name={pokemon.name} 
        size={48}
      />
      <div>
        <div className="font-bold text-xs uppercase tracking-tight">{pokemon.name}</div>
        <div className="flex gap-1 mt-1">
          {pokemon.types.map(t => (
            <span key={t} className={`${TYPE_COLORS[t]} text-[8px] px-1 rounded-sm text-white font-black uppercase`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
