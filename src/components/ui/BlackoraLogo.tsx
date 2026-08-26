import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BlackoraLogo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl md:text-4xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Custom Geometric Shield & Timepiece Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-600 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-out opacity-90 shadow-md shadow-amber-500/20"></div>
        <div className="absolute inset-[2px] bg-[#0b0c10] rounded-md rotate-45 flex items-center justify-center">
          <span className="text-[10px] font-black text-amber-300 tracking-tighter">B</span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`font-serif tracking-[0.25em] font-extrabold uppercase bg-gradient-to-r from-zinc-100 via-amber-200 to-amber-400 bg-clip-text text-transparent ${sizeClasses[size]}`}>
          BLACKORA
        </span>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium -mt-1">
            Haute Horlogerie
          </span>
        )}
      </div>
    </Link>
  );
}
