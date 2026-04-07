"use client";

import React from 'react';
import { Dumbbell, Zap } from 'lucide-react';

const WorkoutHeader = () => {
  return (
    <header className="bg-primary text-primary-foreground py-6 px-4 rounded-b-3xl shadow-lg mb-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Ki-Fit <Zap className="text-yellow-400 fill-yellow-400" size={24} />
          </h1>
          <p className="text-primary-foreground/80 text-sm font-medium">Seu treino de hoje está pronto!</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
          <Dumbbell size={28} className="text-white" />
        </div>
      </div>
    </header>
  );
};

export default WorkoutHeader;