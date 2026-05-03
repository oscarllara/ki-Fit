"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showTagline = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-5xl", body: "text-[10px]", tagline: "text-[7px]", dot: "w-2 h-2", gap: "-ml-4" },
    md: { ki: "text-7xl", body: "text-sm", tagline: "text-[9px]", dot: "w-3 h-3", gap: "-ml-6" },
    lg: { ki: "text-9xl", body: "text-xl", tagline: "text-[11px]", dot: "w-5 h-5", gap: "-ml-8" }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* Ki Stylized com efeito de corte (Slice) */}
        <div className="flex items-end italic select-none relative">
          {/* Letra K - Base com brilho neon */}
          <span className={`${currentSize.ki} font-black text-primary -skew-x-[18deg] tracking-tighter drop-shadow-[0_0_20px_rgba(184,255,0,0.5)]`}>
            K
          </span>
          
          {/* Letra i - Sobreposta e "cortada" */}
          <div className={`flex flex-col items-center ${currentSize.gap} z-10 relative`}>
            {/* Ponto do 'i' flutuante */}
            <div className={`${currentSize.dot} bg-primary rounded-full mb-1 shadow-[0_0_15px_rgba(184,255,0,0.8)]`} />
            
            {/* O corpo do 'i' com um clip-path para simular o corte na base do K */}
            <span 
              className={`${currentSize.ki} font-black text-white -skew-x-[18deg] leading-[0.65]`}
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%)',
                filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.5))'
              }}
            >
              i
            </span>
          </div>
        </div>
        
        {/* BODY FIT - Ajustado para acompanhar a nova inclinação */}
        <div className={`${currentSize.body} font-black tracking-[0.6em] text-white italic uppercase -mt-3 drop-shadow-lg ml-4`}>
          BODY <span className="text-primary">FIT</span>
        </div>

        {showTagline && (
          <div className="mt-8 flex flex-col items-center w-full max-w-[380px]">
            <div className="flex items-center gap-5 w-full mb-2">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-white/30 to-white/50" />
              {/* EKG Line - Mais agressiva */}
              <svg width="45" height="22" viewBox="0 0 24 12" className="text-primary fill-none stroke-current stroke-[3]">
                <path d="M0 6h3l1-3 1.5 9 2-6h2l1-4 1.5 8 1.5-4h6" />
              </svg>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-white/30 to-white/50" />
            </div>
            <p className={`${currentSize.tagline} font-black tracking-[0.4em] text-white uppercase whitespace-nowrap opacity-90`}>
              TREINE. <span className="text-primary">SUPERE.</span> EVOLUA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;