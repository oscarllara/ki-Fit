"use client";

import React from 'react';
import Logo from './Logo';
import { Dumbbell, Calendar, TrendingUp, HeartPulse, Users, Zap } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-black pt-16 pb-32 px-6 rounded-b-[5rem] shadow-2xl mb-8 border-b border-[#b8ff00]/10">
      {/* Efeito de iluminação de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(184,255,0,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Logo Oficial em PNG */}
        <Logo size="lg" className="mb-12" />
        
        {/* Slogan de Apoio - Estilizado via código para manter nitidez e flexibilidade */}
        <div className="w-full max-w-3xl border border-[#b8ff00]/30 rounded-[2.5rem] p-6 md:p-10 bg-white/[0.02] backdrop-blur-xl relative group shadow-2xl shadow-black">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-6 py-0.5 rounded-full border border-[#b8ff00]/20 text-[9px] font-black text-[#b8ff00] uppercase tracking-[0.3em]">
            Slogan de Apoio
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="p-5 border border-[#b8ff00]/20 rounded-3xl text-[#b8ff00] bg-[#b8ff00]/5 shadow-[0_0_20px_rgba(184,255,0,0.1)]">
              <Dumbbell size={36} />
            </div>
            
            <div className="flex flex-col text-center md:text-left space-y-1">
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                <span className="text-[#b8ff00]">SUPERE</span> SEUS LIMITES.
              </h2>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                <span className="text-[#b8ff00]">DOMINE</span> SUA ROTINA.
              </h2>
            </div>

            <div className="p-5 border border-[#b8ff00]/20 rounded-3xl text-[#b8ff00] bg-[#b8ff00]/5 shadow-[0_0_20px_rgba(184,255,0,0.1)] hidden md:block">
              <Calendar size={36} />
            </div>
          </div>
        </div>

        {/* Régua de Benefícios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-4xl">
          {[
            { icon: TrendingUp, label: "TREINOS", sub: "PERSONALIZADOS" },
            { icon: Zap, label: "ACOMPANHE", sub: "SUA EVOLUÇÃO" },
            { icon: HeartPulse, label: "MAIS SAÚDE", sub: "E PERFORMANCE" },
            { icon: Users, label: "PARA TODOS", sub: "OS NÍVEIS" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4 group">
              <div className="text-[#b8ff00] opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <item.icon size={32} />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
                {item.label}<br/><span className="text-[#b8ff00]">{item.sub}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;