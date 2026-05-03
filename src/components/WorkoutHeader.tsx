"use client";

import React from 'react';
import Logo from './Logo';
import { Trophy } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-black pt-16 pb-24 px-6 rounded-b-[4rem] shadow-2xl mb-8 border-b border-primary/20">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-10">
          <Trophy size={16} className="text-primary" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Membro Elite Ki-Fit</span>
        </div>
        
        <Logo size="lg" />
        
        <div className="mt-8 space-y-2">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.1em]">
            Sua melhor versão começa agora
          </p>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;