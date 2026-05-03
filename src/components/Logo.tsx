"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showTagline = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-5xl", body: "text-lg", tagline: "text-[10px]", gap: "gap-1" },
    md: { ki: "text-7xl", body: "text-2xl", tagline: "text-xs", gap: "gap-1.5" },
    lg: { ki: "text-9xl", body: "text-4xl", tagline: "text-sm", gap: "gap-2" }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* Ki - Reprodução fiel das imagens oficiais */}
        <div className={`flex items-baseline ${currentSize.gap} font-black select-none`}>
          <span className={`${currentSize.ki} text-[#b8ff00] tracking-tighter`}>
            K
          </span>
          <div className="flex flex-col items-center">
            {/* Ponto do 'i' Quadrado conforme a imagem */}
            <div className="w-[0.22em] h-[0.22em] bg-[#b8ff00] mb-[0.05em]" />
            <span className={`${currentSize.ki} text-[#b8ff00] leading-[0.7]`}>
              i
            </span>
          </div>
        </div>
        
        {/* BODY FIT - Fonte robusta, reta e branca */}
        <div className={`${currentSize.body} font-black tracking-[0.1em] text-white uppercase mt-2`}>
          BODY FIT
        </div>

        {showTagline && (
          <div className="mt-4 flex flex-col items-center">
            <p className={`${currentSize.tagline} font-medium text-[#b8ff00] tracking-tight`}>
              Supere seus limites. Domine sua rotina.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;