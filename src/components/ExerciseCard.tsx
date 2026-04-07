"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Weight, Repeat, Edit2, Trash2, Play } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface ExerciseProps {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ExerciseCard = ({ title, videoUrl, defaultReps, defaultWeight, onEdit, onDelete }: ExerciseProps) => {
  const [reps, setReps] = useState(defaultReps);
  const [weight, setWeight] = useState(defaultWeight);
  const [isCompleted, setIsCompleted] = useState(false);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    if (!isCompleted) {
      showSuccess(`${title} concluído!`);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 border-2 group ${isCompleted ? 'border-green-500 bg-green-50/30' : 'border-transparent shadow-md hover:shadow-lg'}`}>
      <div className="aspect-video w-full bg-slate-200 relative overflow-hidden">
        {videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <Play size={48} className="opacity-20" />
            <span className="text-xs font-medium">Sem vídeo demonstrativo</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={onEdit}>
            <Edit2 size={14} />
          </Button>
          <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md" onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg font-bold leading-tight">
          {title}
          {isCompleted && <CheckCircle2 className="text-green-500 shrink-0" size={22} />}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-500">
              <Repeat size={12} /> Séries/Reps
            </Label>
            <Input 
              type="text" 
              value={reps} 
              onChange={(e) => setReps(e.target.value)}
              className="h-9 bg-slate-50 border-slate-200 focus:ring-primary rounded-lg text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-500">
              <Weight size={12} /> Carga (kg)
            </Label>
            <Input 
              type="text" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="h-9 bg-slate-50 border-slate-200 focus:ring-primary rounded-lg text-sm"
            />
          </div>
        </div>

        <Button 
          onClick={handleComplete}
          variant={isCompleted ? "outline" : "default"}
          className={`w-full font-bold h-12 rounded-xl transition-all ${isCompleted ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100' : 'bg-primary hover:scale-[1.01] shadow-sm'}`}
        >
          {isCompleted ? "Concluído" : "Marcar como Feito"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;