"use client";

import React, { useState, useEffect } from 'react';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDialog from '@/components/ExerciseDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, History } from 'lucide-react';
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

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('nextfit_workouts');
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar treinos", e);
      }
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('nextfit_workouts', JSON.stringify(workouts));
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
    <div className="min-h-screen bg-slate-50 pb-24">
      <WorkoutHeader />
      
      <main className="max-w-4xl mx-auto px-4">
        <Tabs defaultValue="A" onValueChange={(v) => setActiveTab(v as WorkoutType)} className="w-full">
          <div className="sticky top-4 z-10 bg-slate-50/80 backdrop-blur-md py-2 mb-6">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1.5 bg-slate-200/50 border border-slate-200">
              <TabsTrigger value="A" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Treino A</TabsTrigger>
              <TabsTrigger value="B" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Treino B</TabsTrigger>
              <TabsTrigger value="C" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Treino C</TabsTrigger>
            </TabsList>
          </div>
          
          {(['A', 'B', 'C'] as WorkoutType[]).map((type) => (
            <TabsContent key={type} value={type} className="space-y-6 outline-none">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={20} className="text-primary" />
                  <h2 className="text-xl font-extrabold text-slate-800">Exercícios do Dia</h2>
                </div>
                <Button onClick={handleAddExercise} size="sm" className="rounded-full gap-1.5 font-bold shadow-md">
                  <Plus size={16} /> Add
                </Button>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {workouts[type].map((ex) => (
                  <ExerciseCard 
                    key={ex.id}
                    {...ex}
                    onEdit={() => handleEditExercise(ex)}
                    onDelete={() => handleDeleteExercise(ex.id)}
                  />
                ))}
                
                {workouts[type].length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Nenhum exercício neste treino.</p>
                    <Button variant="link" onClick={handleAddExercise} className="mt-2 font-bold">Começar a adicionar</Button>
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

      <footer className="mt-auto">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;