"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showTagline = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-3xl", body: "text-xs", tagline: "text-[6px]" },
    md: { ki: "text-5xl", body: "text-base", tagline: "text-[8px]" },
    lg: { ki: "text-7xl", body: "text-2xl", tagline: "text-[10px]" }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* O "Ki" estilizado */}
        <div className={`${currentSize.ki} font-black italic tracking-tighter flex items-baseline leading-none`}>
          <span className="text-primary -skew-x-12">K</span>
          <span className="text-white -ml-1 -skew-x-12">i</span>
        </div>
        
        {/* O "BODY FIT" */}
        <div className={`${currentSize.body} font-black tracking-[0.3em] text-white mt-1 italic uppercase`}>
          BODY <span className="text-primary">FIT</span>
        </div>

        {showTagline && (
          <div className="mt-2 flex flex-col items-center w-full">
            <div className="flex items-center gap-2 w-full">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              {/* Linha de batimento simplificada em SVG */}
              <svg width="20" height="10" viewBox="0 0 20 10" className="text-primary fill-none stroke-current stroke-2">
                <path d="M0 5h4l2-4 2 8 2-4h10" />
              </svg>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            </div>
            <p className={`${currentSize.tagline} font-bold tracking-[0.2em] text-white/70 mt-1 uppercase`}>
              TREINE. <span className="text-primary">SUPERE.</span> EVOLUA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;