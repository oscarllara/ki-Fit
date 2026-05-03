"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showTagline = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-5xl", body: "text-[10px]", tagline: "text-[7px]", dot: "w-2 h-2", gap: "-ml-3" },
    md: { ki: "text-7xl", body: "text-sm", tagline: "text-[9px]", dot: "w-3 h-3", gap: "-ml-4" },
    lg: { ki: "text-9xl", body: "text-xl", tagline: "text-[11px]", dot: "w-5 h-5", gap: "-ml-6" }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* Ki Stylized - Reprodução fiel da sobreposição */}
        <div className="flex items-end italic select-none">
          <span className={`${currentSize.ki} font-black text-primary -skew-x-[15deg] tracking-tighter drop-shadow-[0_0_15px_rgba(184,255,0,0.4)]`}>
            K
          </span>
          <div className={`flex flex-col items-center ${currentSize.gap} z-10`}>
            {/* Ponto do 'i' em Verde Neon */}
            <div className={`${currentSize.dot} bg-primary rounded-full mb-1 shadow-[0_0_10px_rgba(184,255,0,0.8)]`} />
            <span className={`${currentSize.ki} font-black text-white -skew-x-[15deg] leading-[0.7]`}>
              i
            </span>
          </div>
        </div>
        
        {/* BODY FIT - Itálico, Negrito e Espaçado */}
        <div className={`${currentSize.body} font-black tracking-[0.5em] text-white italic uppercase -mt-2 drop-shadow-md`}>
          BODY <span className="text-primary">FIT</span>
        </div>

        {showTagline && (
          <div className="mt-6 flex flex-col items-center w-full max-w-[350px]">
            <div className="flex items-center gap-4 w-full mb-2">
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40" />
              {/* EKG Line - Batimento Cardíaco */}
              <svg width="40" height="20" viewBox="0 0 24 12" className="text-primary fill-none stroke-current stroke-[2.5]">
                <path d="M0 6h4l1.5-4 2 8 2-4h2l1.5-4 2 8 2-4h5" />
              </svg>
              <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40" />
            </div>
            <p className={`${currentSize.tagline} font-black tracking-[0.3em] text-white uppercase whitespace-nowrap`}>
              TREINE. <span className="text-primary">SUPERE.</span> EVOLUA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;