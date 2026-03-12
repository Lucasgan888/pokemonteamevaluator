'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pokemon, PokemonType, TYPE_COLORS } from '@/lib/pokemon';
import PokemonImage from './PokemonImage';
import Link from 'next/link';

interface SortablePokemonProps {
  pokemon: Pokemon;
  onRemove: () => void;
}

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

export default function SortablePokemon({ pokemon, onRemove }: SortablePokemonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `team-${pokemon.name}`,
    data: {
      type: 'team-item',
      pokemon,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={() => onRemove()}
      className="lab-card p-4 flex flex-col items-center gap-2 relative group hover:border-red-500/50 transition-colors cursor-pointer touch-none"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition z-10"
      >
        ✕
      </button>
      
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex flex-col items-center w-full">
        <div className="relative mb-2">
          <PokemonImage 
            spriteUrl={pokemon.spriteUrl} 
            emoji={pokemon.sprite} 
            name={pokemon.name} 
            size={72}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-1 w-full">
          {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
        </div>
      </div>
    </div>
  );
}
