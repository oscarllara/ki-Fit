"use client";

import React from 'react';
import { Dumbbell, Zap, Trophy } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-primary pt-12 pb-16 px-6 rounded-b-[3rem] shadow-2xl shadow-primary/20 mb-8">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30">
            <Dumbbell size={24} className="text-white" />
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Nível 1</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
            Ki-Fit <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
          </h1>
          <p className="text-white/70 text-lg font-medium">Pronto para superar seus limites hoje?</p>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;