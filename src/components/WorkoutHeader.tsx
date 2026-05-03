"use client";

import React from 'react';
import Logo from './Logo';
import { Dumbbell, TrendingUp, HeartPulse, Users, Zap } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-black pt-20 pb-32 px-6 rounded-b-[5rem] shadow-2xl mb-8 border-b border-[#b8ff00]/10">
      {/* Efeito de iluminação sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(184,255,0,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <Logo size="lg" className="mb-16" />
        
        {/* Régua de Benefícios - Ícones e textos alinhados com a nova identidade */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-[#b8ff00] group-hover:bg-[#b8ff00]/10 transition-all duration-300">
              <TrendingUp size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              TREINOS<br/><span className="text-[#b8ff00]">PERSONALIZADOS</span>
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-[#b8ff00] group-hover:bg-[#b8ff00]/10 transition-all duration-300">
              <Zap size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              ACOMPANHE<br/><span className="text-[#b8ff00]">SUA EVOLUÇÃO</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-[#b8ff00] group-hover:bg-[#b8ff00]/10 transition-all duration-300">
              <HeartPulse size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              MAIS SAÚDE<br/><span className="text-[#b8ff00]">E PERFORMANCE</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-[#b8ff00] group-hover:bg-[#b8ff00]/10 transition-all duration-300">
              <Users size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              PARA TODOS<br/><span className="text-[#b8ff00]">OS NÍVEIS</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;