"use client";

import React from 'react';
import Logo from './Logo';
import { Dumbbell, Calendar, Armchair, TrendingUp, HeartPulse, Users } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-black pt-16 pb-32 px-6 rounded-b-[4rem] shadow-2xl mb-8 border-b border-primary/10">
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <Logo size="lg" className="mb-12" />
        
        {/* Slogan de Apoio Box */}
        <div className="w-full max-w-2xl border-2 border-primary/30 rounded-3xl p-6 md:p-8 bg-primary/5 backdrop-blur-sm relative overflow-hidden group hover:border-primary/60 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Dumbbell size={32} />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                SUPERE <span className="text-primary">SEUS LIMITES.</span>
              </h2>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none mt-1">
                DOMINE <span className="text-primary">SUA ROTINA.</span>
              </h2>
            </div>

            <div className="p-4 bg-primary/10 rounded-2xl text-primary hidden md:block">
              <Calendar size={32} />
            </div>
          </div>
        </div>

        {/* Régua de Benefícios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-3 group">
            <div className="text-primary group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              TREINOS<br/><span className="text-primary">PERSONALIZADOS</span>
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3 group">
            <div className="text-primary group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              ACOMPANHE<br/><span className="text-primary">SUA EVOLUÇÃO</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 group">
            <div className="text-primary group-hover:scale-110 transition-transform">
              <HeartPulse size={28} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              MAIS SAÚDE<br/><span className="text-primary">E PERFORMANCE</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 group">
            <div className="text-primary group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
              PARA TODOS<br/><span className="text-primary">OS NÍVEIS</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;