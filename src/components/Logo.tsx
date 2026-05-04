"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-5xl", body: "text-lg", tagline: "text-[8px]", dot: "w-3 h-4", gap: "-ml-4" },
    md: { ki: "text-7xl", body: "text-2xl", tagline: "text-[10px]", dot: "w-4 h-6", gap: "-ml-6" },
    lg: { ki: "text-9xl", body: "text-5xl", tagline: "text-xs", gap: "-ml-10" }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* Ki Stylized - Réplica fiel em código */}
        <div className="flex items-end italic relative">
          {/* Letra K - Verde Limão Vibrante */}
          <span className={`${currentSize.ki} font-black text-[#b8ff00] -skew-x-[20deg] tracking-tighter z-20 drop-shadow-[0_0_10px_rgba(184,255,0,0.3)]`}>
            K
          </span>
          
          {/* Letra i - Branca e Cortada */}
          <div className={`flex flex-col items-center ${currentSize.gap} z-10 relative`}>
            {/* Ponto do 'i' Oval e Inclinado */}
            <div 
              className={`${currentSize.dot} bg-[#b8ff00] rounded-[100%] mb-1 -skew-x-[20deg] shadow-[0_0_15px_rgba(184,255,0,0.4)]`} 
              style={{ transform: 'rotate(-10deg) skewX(-20deg)' }}
            />
            
            {/* Corpo do 'i' com corte na diagonal */}
            <span 
              className={`${currentSize.ki} font-black text-white -skew-x-[20deg] leading-[0.65]`}
              style={{ 
                clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)'
              }}
            >
              i
            </span>
          </div>
        </div>
        
        {/* BODY FIT - Itálico e com cores alternadas */}
        <div className={`${currentSize.body} font-black italic tracking-tighter uppercase -mt-2 flex gap-2`}>
          <span className="text-white">BODY</span>
          <span className="text-[#b8ff00]">FIT</span>
        </div>

        {/* Slogan e EKG (Batimento) */}
        <div className="mt-6 flex flex-col items-center w-full">
          <div className="flex items-center gap-3 w-full max-w-[300px] mb-3">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/40" />
            <svg width="30" height="15" viewBox="0 0 24 12" className="text-[#b8ff00] fill-none stroke-current stroke-[2]">
              <path d="M0 6h4l1-3 1.5 8 1.5-5h2l1-4 1.5 7 1 -3h5" />
            </svg>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/40" />
          </div>
          
          <p className={`${currentSize.tagline} font-bold tracking-[0.3em] text-white uppercase whitespace-nowrap`}>
            TREINE. <span className="text-[#b8ff00]">SUPERE.</span> EVOLUA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logo;