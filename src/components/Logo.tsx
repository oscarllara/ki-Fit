"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  const widths = {
    sm: "w-32",
    md: "w-48",
    lg: "w-72 md:w-96"
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Link atualizado para a logo correta enviada por você */}
      <img 
        src="dyad-media://media/Ki-Fit/.dyad/media/601e85b9276818965136206b7c111b14.png" 
        alt="Ki Body Fit Logo" 
        className={`${widths[size]} h-auto object-contain drop-shadow-[0_0_20px_rgba(184,255,0,0.2)]`}
      />
    </div>
  );
};

export default Logo;