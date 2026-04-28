"use client";

import React, { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface RestTimerProps {
  duration?: number;
  onClose: () => void;
}

const RestTimer = ({ duration = 60, onClose }: RestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      // Som de notificação opcional aqui
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs">
      <div className="bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl flex items-center gap-4 overflow-hidden relative">
        {/* Barra de progresso de fundo */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000" 
          style={{ width: `${100 - progress}%` }}
        />

        <div className="bg-primary/20 p-3 rounded-2xl">
          <Timer className="text-primary animate-pulse" size={24} />
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descanso</p>
          <p className="text-2xl font-black tabular-nums">{formatTime(timeLeft)}</p>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsActive(!isActive)}
            className="h-10 w-10 rounded-xl hover:bg-white/10"
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-400"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;