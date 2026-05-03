"use client";

import React from 'react';
import Logo from './Logo';
import { Dumbbell, Calendar, TrendingUp, HeartPulse, Users, Zap } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-black pt-20 pb-32 px-6 rounded-b-[5rem] shadow-2xl mb-8 border-b border-[#b8ff00]/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(184,255,0,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <Logo size="lg" className="mb-16" />
        
        {/* Slogan de Apoio - Réplica da Imagem */}
        <div className="w-full max-w-3xl border border-[#b8ff00]/40 rounded-3xl p-6 md:p-8 bg-white/[0.02] backdrop-blur-md relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-[10px] font-black text-[#b8ff00] uppercase tracking-widest">
            Slogan de Apoio
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <div className="p-4 border border-[#b8ff00]/20 rounded-2xl text-[#b8ff00]">
              <Dumbbell size={32} />
            </div>
            
            <div className="flex flex-col text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-tight">
                <span className="text-[#b8ff00]">SUPERE</span> SEUS LIMITES.
              </h2>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-tight">
                <span className="text-[#b8ff00]">DOMINE</span> SUA ROTINA.
              </h2>
            </div>

            <div className="p-4 border border-[#b8ff00]/20 rounded-2xl text-[#b8ff00] hidden md:block">
              <Calendar size={32} />
            </div>
          </div>
        </div>

        {/* Régua de Benefícios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-20 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-4 group">
            <div className="text-[#b8ff00] opacity-80 group-hover:opacity-100 transition-opacity">
              <TrendingUp size={32} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              TREINOS<br/><span className="text-[#b8ff00]">PERSONALIZADOS</span>
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 group">
            <div className="text-[#b8ff00] opacity-80 group-hover:opacity-100 transition-opacity">
              <Zap size={32} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              ACOMPANHE<br/><span className="text-[#b8ff00]">SUA EVOLUÇÃO</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="text-[#b8ff00] opacity-80 group-hover:opacity-100 transition-opacity">
              <HeartPulse size={32} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              MAIS SAÚDE<br/><span className="text-[#b8ff00]">E PERFORMANCE</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="text-[#b8ff00] opacity-80 group-hover:opacity-100 transition-opacity">
              <Users size={32} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              PARA TODOS<br/><span className="text-[#b8ff00]">OS NÍVEIS</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;