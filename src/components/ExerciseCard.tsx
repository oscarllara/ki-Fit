"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlayCircle, Weight, Repeat } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface ExerciseProps {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
}

const ExerciseCard = ({ title, videoUrl, defaultReps, defaultWeight }: ExerciseProps) => {
  const [reps, setReps] = useState(defaultReps);
  const [weight, setWeight] = useState(defaultWeight);
  const [isCompleted, setIsCompleted] = useState(false);

  // Extrair ID do vídeo do YouTube
  const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    if (!isCompleted) {
      showSuccess(`${title} concluído!`);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 border-2 ${isCompleted ? 'border-green-500 bg-green-50/30' : 'border-transparent'}`}>
      <div className="aspect-video w-full bg-muted relative">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-xl">
          {title}
          {isCompleted && <CheckCircle2 className="text-green-500" size={24} />}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Repeat size={14} /> Repetições
            </Label>
            <Input 
              type="text" 
              value={reps} 
              onChange={(e) => setReps(e.target.value)}
              placeholder="Ex: 12"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Weight size={14} /> Carga (kg)
            </Label>
            <Input 
              type="text" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 20"
              className="bg-background"
            />
          </div>
        </div>

        <Button 
          onClick={handleComplete}
          variant={isCompleted ? "outline" : "default"}
          className={`w-full font-bold py-6 rounded-xl transition-all ${isCompleted ? 'text-green-600 border-green-200' : 'bg-primary hover:scale-[1.02]'}`}
        >
          {isCompleted ? "Concluído" : "Marcar como Feito"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;