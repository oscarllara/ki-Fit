"use client";

import React from 'react';
import Logo from './Logo';
import { Dumbbell, Calendar, TrendingUp, HeartPulse, Users, Zap } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-black pt-20 pb-32 px-6 rounded-b-[5rem] shadow-2xl mb-8 border-b border-primary/20">
      {/* Efeito de iluminação de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(184,255,0,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <Logo size="lg" className="mb-16" />
        
        {/* Slogan de Apoio Box - Estilo Premium */}
        <div className="w-full max-w-2xl border-2 border-primary/40 rounded-[2.5rem] p-8 md:p-10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group hover:border-primary/80 transition-all duration-700 shadow-[0_0_40px_rgba(184,255,0,0.05)]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
            <div className="p-5 bg-primary/10 rounded-3xl text-primary shadow-inner">
              <Zap size={36} className="fill-primary/20" />
            </div>
            
            <div className="flex flex-col text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                SUPERE <span className="text-primary">SEUS LIMITES.</span>
              </h2>
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none mt-2">
                DOMINE <span className="text-primary">SUA ROTINA.</span>
              </h2>
            </div>

            <div className="p-5 bg-primary/10 rounded-3xl text-primary hidden md:block shadow-inner">
              <Dumbbell size={36} className="fill-primary/20" />
            </div>
          </div>
        </div>

        {/* Régua de Benefícios com ícones da imagem */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-20 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <TrendingUp size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              TREINOS<br/><span className="text-primary">PERSONALIZADOS</span>
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <Zap size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              ACOMPANHE<br/><span className="text-primary">SUA EVOLUÇÃO</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <HeartPulse size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              MAIS SAÚDE<br/><span className="text-primary">E PERFORMANCE</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <Users size={28} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
              PARA TODOS<br/><span className="text-primary">OS NÍVEIS</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;