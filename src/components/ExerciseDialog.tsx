"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { Search, Sparkles } from 'lucide-react';

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
  const [isSearching, setIsSearching] = useState(false);

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

  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // Busca inteligente de vídeo
  const handleTitleBlur = async () => {
    if (!title.trim() || videoUrl) return;
    
    setIsSearching(true);
    const { data } = await supabase
      .from('exercises')
      .select('video_url')
      .ilike('title', title.trim())
      .not('video_url', 'is', null)
      .limit(1);
    
    if (data && data[0]?.video_url) {
      setVideoUrl(data[0].video_url);
    }
    setIsSearching(false);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title: title.trim(),
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
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Exercício</Label>
            <div className="relative">
              <Input 
                value={title} 
                onChange={(e) => setTitle(capitalizeWords(e.target.value))} 
                onBlur={handleTitleBlur}
                placeholder="Ex: Supino Reto" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold pr-10"
              />
              {isSearching && <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-pulse" size={18} />}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              URL do Vídeo {videoUrl && <Sparkles size={12} className="text-yellow-500 fill-yellow-500" />}
            </Label>
            <Input 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              placeholder="Link do YouTube" 
              className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Séries/Reps</Label>
              <Input value={reps} onChange={(e) => setReps(e.target.value)} className="h-12 rounded-2xl bg-slate-50 border-none font-bold" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Carga (kg)</Label>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} className="h-12 rounded-2xl bg-slate-50 border-none font-bold" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            Salvar Exercício
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;