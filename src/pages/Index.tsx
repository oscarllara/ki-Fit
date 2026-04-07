"use client";

import React, { useState, useEffect } from 'react';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDialog from '@/components/ExerciseDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Sparkles } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface Exercise {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
}

type WorkoutType = 'A' | 'B' | 'C';

const INITIAL_WORKOUTS: Record<WorkoutType, Exercise[]> = {
  A: [
    { id: 'a1', title: 'Supino Reto - Barra', videoUrl: 'https://www.youtube.com/watch?v=sqOw2Y6u9as', defaultReps: '4x10', defaultWeight: '60' },
    { id: 'a2', title: 'Supino - Halter - Banco Inclinado', videoUrl: 'https://www.youtube.com/watch?v=8iPvtM_8Wvw', defaultReps: '4x10', defaultWeight: '24' },
    { id: 'a3', title: 'Crucifixo - Peck Deck', videoUrl: 'https://www.youtube.com/watch?v=Z57CtWpXGuQ', defaultReps: '3x12', defaultWeight: '45' },
    { id: 'a4', title: 'Tríceps Pulley - Crossover - Corda', videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME', defaultReps: '4x12', defaultWeight: '30' },
    { id: 'a5', title: 'Tríceps no Banco', videoUrl: '', defaultReps: '3x15', defaultWeight: '0' },
    { id: 'a6', title: 'Desenvolvimento - Máquina Articulada', videoUrl: '', defaultReps: '4x10', defaultWeight: '20' },
    { id: 'a7', title: 'Flexão de Braço - Solo', videoUrl: '', defaultReps: '3xMax', defaultWeight: '0' },
    { id: 'a8', title: 'Tríceps Supino', videoUrl: '', defaultReps: '3x10', defaultWeight: '40' },
    { id: 'a9', title: 'Abdominal Supra - Banco Declinado', videoUrl: '', defaultReps: '4x20', defaultWeight: '0' },
  ],
  B: [
    { id: 'b1', title: 'Remada Baixa - Triângulo', videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74', defaultReps: '4x12', defaultWeight: '50' },
    { id: 'b2', title: 'Rosca Direta - Duplo Halter', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', defaultReps: '3x10', defaultWeight: '12' },
    { id: 'b3', title: 'Puxada Aberta - Pronada', videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', defaultReps: '4x12', defaultWeight: '45' },
    { id: 'b4', title: 'Remada Alta - Barra Polia Baixa', videoUrl: '', defaultReps: '3x12', defaultWeight: '35' },
    { id: 'b5', title: 'Elevação Lateral - Halter', videoUrl: '', defaultReps: '4x12', defaultWeight: '8' },
    { id: 'b6', title: 'Rosca Scott - Barra Reta', videoUrl: '', defaultReps: '3x10', defaultWeight: '25' },
    { id: 'b7', title: 'Rosca Martelo - Halter', videoUrl: '', defaultReps: '3x12', defaultWeight: '10' },
    { id: 'b8', title: 'Remada Articulada Neutra', videoUrl: '', defaultReps: '4x10', defaultWeight: '40' },
    { id: 'b9', title: 'Desenvolvimento - Duplo Halter', videoUrl: '', defaultReps: '3x10', defaultWeight: '14' },
    { id: 'b10', title: 'Rosca Invertida - Barra', videoUrl: '', defaultReps: '3x12', defaultWeight: '15' },
    { id: 'b11', title: 'Abdominal com Rolinho', videoUrl: '', defaultReps: '3x15', defaultWeight: '0' },
  ],
  C: [
    { id: 'c1', title: 'Extensora - Cadeira Articulada', videoUrl: 'https://www.youtube.com/watch?v=m0FOpMEgero', defaultReps: '4x15', defaultWeight: '40' },
    { id: 'c2', title: 'Leg Press Horizontal', videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7mpJQ', defaultReps: '4x12', defaultWeight: '100' },
    { id: 'c3', title: 'Flexora - Mesa/Cama', videoUrl: '', defaultReps: '4x12', defaultWeight: '35' },
    { id: 'c4', title: 'Agachamento Sumô - Halter', videoUrl: '', defaultReps: '3x12', defaultWeight: '20' },
    { id: 'c5', title: 'Abdutor - Cadeira Articulada', videoUrl: '', defaultReps: '3x20', defaultWeight: '50' },
    { id: 'c6', title: 'Leg Press 60 - Articulado', videoUrl: '', defaultReps: '4x10', defaultWeight: '120' },
    { id: 'c7', title: 'Agachamento Guiado - Hack', videoUrl: '', defaultReps: '3x12', defaultWeight: '40' },
    { id: 'c8', title: 'Flexão Plantar - Em Pé', videoUrl: '', defaultReps: '4x20', defaultWeight: '0' },
  ]
};

const Index = () => {
  const [workouts, setWorkouts] = useState<Record<WorkoutType, Exercise[]>>(INITIAL_WORKOUTS);
  const [activeTab, setActiveTab] = useState<WorkoutType>('A');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kifit_workouts');
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar treinos", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kifit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleAddExercise = () => {
    setEditingExercise(null);
    setIsDialogOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsDialogOpen(true);
  };

  const handleDeleteExercise = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este exercício?')) {
      setWorkouts(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(ex => ex.id !== id)
      }));
      showSuccess('Exercício removido!');
    }
  };

  const handleSaveExercise = (exercise: Exercise) => {
    setWorkouts(prev => {
      const currentWorkout = prev[activeTab];
      const exists = currentWorkout.find(ex => ex.id === exercise.id);
      
      let newWorkout;
      if (exists) {
        newWorkout = currentWorkout.map(ex => ex.id === exercise.id ? exercise : ex);
      } else {
        newWorkout = [...currentWorkout, exercise];
      }

      return {
        ...prev,
        [activeTab]: newWorkout
      };
    });
    showSuccess(editingExercise ? 'Exercício atualizado!' : 'Exercício adicionado!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 selection:bg-primary selection:text-white">
      <WorkoutHeader />
      
      <main className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <Tabs defaultValue="A" onValueChange={(v) => setActiveTab(v as WorkoutType)} className="w-full">
          <div className="sticky top-6 z-30 bg-slate-50/60 backdrop-blur-xl py-4 mb-8 rounded-[2rem] px-2">
            <TabsList className="grid w-full grid-cols-3 h-16 rounded-[1.5rem] p-2 bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
              <TabsTrigger value="A" className="rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300">Treino A</TabsTrigger>
              <TabsTrigger value="B" className="rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300">Treino B</TabsTrigger>
              <TabsTrigger value="C" className="rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300">Treino C</TabsTrigger>
            </TabsList>
          </div>
          
          {(['A', 'B', 'C'] as WorkoutType[]).map((type) => (
            <TabsContent key={type} value={type} className="space-y-8 outline-none">
              <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={18} className="fill-primary/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sua Jornada</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Exercícios do Dia</h2>
                </div>
                <Button onClick={handleAddExercise} size="lg" className="rounded-full h-14 w-14 p-0 shadow-2xl shadow-primary/40 hover:scale-110 transition-transform">
                  <Plus size={24} />
                </Button>
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2">
                {workouts[type].map((ex, index) => (
                  <div key={ex.id} className="exercise-card-enter" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ExerciseCard 
                      {...ex}
                      onEdit={() => handleEditExercise(ex)}
                      onDelete={() => handleDeleteExercise(ex.id)}
                    />
                  </div>
                ))}
                
                {workouts[type].length === 0 && (
                  <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 shadow-inner">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LayoutGrid size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">Nenhum exercício neste treino.</p>
                    <Button variant="link" onClick={handleAddExercise} className="mt-2 font-black text-primary uppercase tracking-widest text-xs">Começar a adicionar</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <ExerciseDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={handleSaveExercise}
        initialData={editingExercise}
      />

      <footer className="mt-12">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;