"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Exercise {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
}

interface ExerciseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  initialData?: Exercise | null;
}

const ExerciseDialog = ({ isOpen, onClose, onSave, initialData }: ExerciseDialogProps) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [reps, setReps] = useState('3x12');
  const [weight, setWeight] = useState('0');

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title || '');
      setVideoUrl(initialData.videoUrl || '');
      setReps(initialData.defaultReps || '3x12');
      setWeight(initialData.defaultWeight || '0');
    } else if (isOpen) {
      setTitle('');
      setVideoUrl('');
      setReps('3x12');
      setWeight('0');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title,
      videoUrl,
      defaultReps: reps,
      defaultWeight: weight,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-slate-800">
            {initialData ? 'Editar Exercício' : 'Novo Exercício'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Exercício</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Supino Reto" 
              className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL do Vídeo (YouTube)</Label>
            <Input 
              id="video" 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              placeholder="Cole o link do YouTube aqui" 
              className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reps" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Séries/Reps</Label>
              <Input 
                id="reps" 
                value={reps} 
                onChange={(e) => setReps(e.target.value)} 
                placeholder="4x10" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Carga (kg)</Label>
              <Input 
                id="weight" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                placeholder="20" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleSave} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            Salvar Exercício
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;