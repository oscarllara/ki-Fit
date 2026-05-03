"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showTagline = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-3xl", body: "text-xs", tagline: "text-[7px]" },
    md: { ki: "text-5xl", body: "text-base", tagline: "text-[9px]" },
    lg: { ki: "text-7xl", body: "text-2xl", tagline: "text-[11px]" }
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
          <div className="mt-3 flex flex-col items-center w-full">
            <div className="flex items-center gap-3 w-full mb-1">
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
              {/* Linha de batimento (EKG) */}
              <svg width="24" height="12" viewBox="0 0 24 12" className="text-primary fill-none stroke-current stroke-[2.5]">
                <path d="M0 6h4l1.5-4 2 8 2-4h2l1.5-4 2 8 2-4h5" />
              </svg>
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
            </div>
            <p className={`${currentSize.tagline} font-black tracking-[0.25em] text-white uppercase`}>
              TREINE. <span className="text-primary">SUPERE.</span> EVOLUA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;