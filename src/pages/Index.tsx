"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDialog from '@/components/ExerciseDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Sparkles, User } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface Exercise {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
  level?: number;
  completions?: number;
}

type WorkoutType = 'A' | 'B' | 'C';

const INITIAL_WORKOUTS: Record<WorkoutType, Exercise[]> = {
  A: [
    { id: 'a1', title: 'Supino Reto - Barra', videoUrl: 'https://www.youtube.com/watch?v=sqOw2Y6u9as', defaultReps: '4x10', defaultWeight: '60', level: 1, completions: 0 },
    { id: 'a2', title: 'Supino - Halter - Banco Inclinado', videoUrl: 'https://www.youtube.com/watch?v=8iPvtM_8Wvw', defaultReps: '4x10', defaultWeight: '24', level: 1, completions: 0 },
    { id: 'a3', title: 'Crucifixo - Peck Deck', videoUrl: 'https://www.youtube.com/watch?v=Z57CtWpXGuQ', defaultReps: '3x12', defaultWeight: '45', level: 1, completions: 0 },
  ],
  B: [],
  C: []
};

const Index = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Record<WorkoutType, Exercise[]>>(INITIAL_WORKOUTS);
  const [activeTab, setActiveTab] = useState<WorkoutType>('A');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kifit_user');
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }

    const saved = localStorage.getItem('kifit_workouts');
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar treinos", e);
      }
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('kifit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleUpdateStats = (id: string, completions: number, level: number) => {
    setWorkouts(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(ex => 
        ex.id === id ? { ...ex, completions, level } : ex
      )
    }));
  };

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
        newWorkout = currentWorkout.map(ex => ex.id === exercise.id ? { ...ex, ...exercise } : ex);
      } else {
        newWorkout = [...currentWorkout, { ...exercise, level: 1, completions: 0 }];
      }

      return { ...prev, [activeTab]: newWorkout };
    });
    showSuccess(editingExercise ? 'Exercício atualizado!' : 'Exercício adicionado!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <WorkoutHeader />
      
      <main className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" onClick={() => navigate('/login')} className="rounded-full gap-2 text-white/80 hover:text-white hover:bg-white/10">
            <User size={18} /> {user?.nome || 'Perfil'}
          </Button>
        </div>

        <Tabs defaultValue="A" onValueChange={(v) => setActiveTab(v as WorkoutType)} className="w-full">
          <div className="sticky top-6 z-30 bg-slate-50/60 backdrop-blur-xl py-4 mb-8 rounded-[2rem] px-2">
            <TabsList className="grid w-full grid-cols-3 h-16 rounded-[1.5rem] p-2 bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
              <TabsTrigger value="A" className="rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">Treino A</TabsTrigger>
              <TabsTrigger value="B" className="rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">Treino B</TabsTrigger>
              <TabsTrigger value="C" className="rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">Treino C</TabsTrigger>
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
                      onUpdateStats={handleUpdateStats}
                    />
                  </div>
                ))}
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
      <footer className="mt-12"><MadeWithDyad /></footer>
    </div>
  );
};

export default Index;