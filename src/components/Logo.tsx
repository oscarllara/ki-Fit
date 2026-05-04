"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  // Definindo larguras baseadas no tamanho solicitado
  const widths = {
    sm: "w-32",
    md: "w-48",
    lg: "w-72 md:w-96"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src="dyad-media://media/Ki-Fit/.dyad/media/2ef30bac123c5c61152dc532465296f8.png" 
        alt="Ki Body Fit Logo" 
        className={`${widths[size]} h-auto object-contain drop-shadow-[0_0_15px_rgba(184,255,0,0.2)]`}
      />
    </div>
  );
};

export default Logo;