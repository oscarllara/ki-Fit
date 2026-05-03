"use client";

import React from 'react';
import { Dumbbell, Zap, Trophy } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="relative overflow-hidden bg-slate-950 pt-16 pb-20 px-6 rounded-b-[3.5rem] shadow-2xl mb-8 border-b border-primary/10">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20 relative">
            <Dumbbell size={24} className="text-slate-950" />
            <Zap className="text-slate-950 fill-slate-950 absolute -top-1 -right-1" size={12} />
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <Trophy size={16} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Elite Member</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-white flex items-center gap-3 uppercase">
            Ki Body <span className="text-primary">Fit</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">Supere seus limites. Domine sua rotina.</p>
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;