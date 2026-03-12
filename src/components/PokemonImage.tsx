'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PokemonImageProps {
  spriteUrl?: string;
  emoji: string;
  name: string;
  size?: number;
}

export default function PokemonImage({ spriteUrl, emoji, name, size = 64 }: PokemonImageProps) {
  const [error, setError] = useState(!spriteUrl);
  const [loading, setLoading] = useState(!!spriteUrl);

  return (
    <div 
      className="relative flex items-center justify-center bg-slate-800/50 rounded-lg overflow-hidden"
      style={{ width: size, height: size }}
    >
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-slate-700/50 flex items-center justify-center">
          <span className="text-2xl grayscale opacity-30">{emoji}</span>
        </div>
      )}
      
      {!error && spriteUrl ? (
        <Image
          src={spriteUrl}
          alt={name}
          width={size}
          height={size}
          className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          unoptimized // PokeAPI images often work better unoptimized if they are already small
        />
      ) : (
        <span 
          className="text-3xl" 
          role="img" 
          aria-label={name}
        >
          {emoji}
        </span>
      )}
    </div>
  );
}
