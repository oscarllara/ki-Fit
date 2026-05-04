"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  const widths = {
    sm: "w-24",
    md: "w-40",
    lg: "w-64 md:w-80"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Imagem Ki enviada pelo usuário */}
      <img 
        src="dyad-media://media/Ki-Fit/.dyad/media/efbb9b93aa5a83aba8d07d186b11ff20.png" 
        alt="Ki Logo" 
        className={`${widths[size]} h-auto object-contain drop-shadow-[0_0_15px_rgba(184,255,0,0.3)]`}
      />
      
      {/* Complemento BODY FIT e Slogan */}
      <div className="flex flex-col items-center -mt-2 md:-mt-4">
        <div className={`${textSizes[size]} font-black italic tracking-tighter uppercase flex gap-2`}>
          <span className="text-white">BODY</span>
          <span className="text-[#b8ff00]">FIT</span>
        </div>

        <div className="mt-4 flex flex-col items-center w-full">
          <div className="flex items-center gap-3 w-full max-w-[250px] mb-2">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/40" />
            <svg width="24" height="12" viewBox="0 0 24 12" className="text-[#b8ff00] fill-none stroke-current stroke-[2]">
              <path d="M0 6h4l1-3 1.5 8 1.5-5h2l1-4 1.5 7 1 -3h5" />
            </svg>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/40" />
          </div>
          
          <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase whitespace-nowrap">
            TREINE. <span className="text-[#b8ff00]">SUPERE.</span> EVOLUA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logo;