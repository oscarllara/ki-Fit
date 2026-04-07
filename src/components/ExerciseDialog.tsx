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
    if (initialData) {
      setTitle(initialData.title);
      setVideoUrl(initialData.videoUrl);
      setReps(initialData.defaultReps);
      setWeight(initialData.defaultWeight);
    } else {
      setTitle('');
      setVideoUrl('');
      setReps('3x12');
      setWeight('0');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
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
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Exercício' : 'Novo Exercício'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Nome do Exercício</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Supino Reto" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video">URL do Vídeo (YouTube)</Label>
            <Input id="video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reps">Séries/Reps</Label>
              <Input id="reps" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="4x10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Carga (kg)</Label>
              <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="20" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full rounded-xl">Salvar Exercício</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;