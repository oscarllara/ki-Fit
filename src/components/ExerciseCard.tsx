"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Weight, Repeat, Edit2, Trash2, Play, ChevronRight, Star } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface ExerciseProps {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
  level?: number;
  completions?: number;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStats: (id: string, completions: number, level: number) => void;
}

const ExerciseCard = ({ id, title, videoUrl, defaultReps, defaultWeight, level = 1, completions = 0, onEdit, onDelete, onUpdateStats }: ExerciseProps) => {
  const [reps, setReps] = useState(defaultReps);
  const [weight, setWeight] = useState(defaultWeight);
  const [isCompleted, setIsCompleted] = useState(false);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    // Regex melhorada para capturar diversos formatos de URL do YouTube
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  const handleComplete = () => {
    if (isCompleted) {
      setIsCompleted(false);
      return;
    }

    setIsCompleted(true);
    const newCompletions = completions + 1;
    let newLevel = level;
    
    // Regra para subir de nível: a cada 5 conclusões sobe 1 nível
    if (newCompletions % 5 === 0) {
      newLevel += 1;
      showSuccess(`PARABÉNS! ${title} subiu para o Nível ${newLevel}! 🚀`);
    } else {
      showSuccess(`${title} concluído! (${5 - (newCompletions % 5)} para o próximo nível)`);
    }

    onUpdateStats(id, newCompletions, newLevel);
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-500 border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 rounded-[2.5rem] ${isCompleted ? 'bg-green-50/50 ring-2 ring-green-500/50' : 'bg-white'}`}>
      <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
        {videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3 bg-slate-50">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Play size={32} className="opacity-40 text-primary" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sem vídeo demonstrativo</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Nível {level}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
          <Button size="icon" variant="secondary" className="h-10 w-10 rounded-2xl shadow-xl backdrop-blur-md bg-white/80 hover:bg-white" onClick={onEdit}>
            <Edit2 size={16} className="text-slate-700" />
          </Button>
          <Button size="icon" variant="destructive" className="h-10 w-10 rounded-2xl shadow-xl" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex justify-between items-start text-xl font-black leading-tight tracking-tight text-slate-800">
          <span className="max-w-[85%]">{title}</span>
          {isCompleted && <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} />}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-black text-slate-400">
              <Repeat size={14} className="text-primary" /> Séries/Reps
            </Label>
            <Input 
              type="text" 
              value={reps} 
              onChange={(e) => setReps(e.target.value)}
              className="h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl text-sm font-bold text-slate-700 pl-4"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-black text-slate-400">
              <Weight size={14} className="text-primary" /> Carga (kg)
            </Label>
            <Input 
              type="text" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl text-sm font-bold text-slate-700 pl-4"
            />
          </div>
        </div>

        <Button 
          onClick={handleComplete}
          variant={isCompleted ? "outline" : "default"}
          className={`w-full font-black h-14 rounded-[1.5rem] transition-all duration-300 text-sm uppercase tracking-widest shadow-lg ${isCompleted ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100 shadow-none' : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] shadow-primary/20'}`}
        >
          {isCompleted ? "Concluído" : (
            <span className="flex items-center gap-2">
              Marcar como Feito <ChevronRight size={18} />
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;