"use client";

import React from 'react';
import { Trophy, Target, Zap, Flame } from 'lucide-react';

interface ProgressStatsProps {
  totalCompletions: number;
  averageLevel: number;
  workoutCount: number;
}

const ProgressStats = ({ totalCompletions, averageLevel, workoutCount }: ProgressStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-xl text-primary">
            <Trophy size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nível Médio</span>
        </div>
        <p className="text-2xl font-black text-white">{averageLevel.toFixed(1)}</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/20 rounded-xl text-orange-500">
            <Flame size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Feitos</span>
        </div>
        <p className="text-2xl font-black text-white">{totalCompletions}</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
            <Target size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exercícios</span>
        </div>
        <p className="text-2xl font-black text-white">{workoutCount}</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary rounded-xl text-slate-950">
            <Zap size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
        </div>
        <p className="text-sm font-black text-primary uppercase tracking-tighter">Em Evolução</p>
      </div>
    </div>
  );
};

export default ProgressStats;