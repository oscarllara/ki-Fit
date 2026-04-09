"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDialog from '@/components/ExerciseDialog';
import UserNav from '@/components/UserNav';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Exercise {
  id: string;
  title: string;
  videoUrl: string;
  defaultReps: string;
  defaultWeight: string;
  level?: number;
  completions?: number;
  workout_type?: string;
}

type WorkoutType = 'A' | 'B' | 'C';

const Index = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Record<WorkoutType, Exercise[]>>({ A: [], B: [], C: [] });
  const [activeTab, setActiveTab] = useState<WorkoutType>('A');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUser({ ...user, ...profile });
      fetchExercises(user.id);
    };
    checkUser();
  }, [navigate]);

  const fetchExercises = async (userId: string) => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      showError("Erro ao carregar treinos");
      return;
    }

    const organized: Record<WorkoutType, Exercise[]> = { A: [], B: [], C: [] };
    data.forEach((ex: any) => {
      const type = (ex.workout_type || 'A') as WorkoutType;
      organized[type].push(ex);
    });
    setWorkouts(organized);
  };

  const handleUpdateStats = async (id: string, completions: number, level: number) => {
    const { error } = await supabase
      .from('exercises')
      .update({ completions, level })
      .eq('id', id);

    if (!error) {
      setWorkouts(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(ex => 
          ex.id === id ? { ...ex, completions, level } : ex
        )
      }));
    }
  };

  const handleSaveExercise = async (exercise: Exercise) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const exerciseData = {
      ...exercise,
      user_id: user.id,
      workout_type: activeTab,
      level: exercise.level || 1,
      completions: exercise.completions || 0
    };

    const { error } = await supabase.from('exercises').upsert(exerciseData);

    if (error) {
      showError("Erro ao salvar exercício");
    } else {
      fetchExercises(user.id);
      showSuccess(editingExercise ? 'Atualizado!' : 'Adicionado!');
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (confirm('Excluir este exercício?')) {
      const { error } = await supabase.from('exercises').delete().eq('id', id);
      if (!error) {
        setWorkouts(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].filter(ex => ex.id !== id)
        }));
        showSuccess('Removido!');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <UserNav 
        user={user} 
        onLogout={handleLogout} 
        onAdmin={() => navigate('/admin')}
        isAdmin={user?.email === 'admin@admin.com'}
      />
      
      <WorkoutHeader />
      
      <main className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
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
                <Button onClick={() => { setEditingExercise(null); setIsDialogOpen(true); }} size="lg" className="rounded-full h-14 w-14 p-0 shadow-2xl shadow-primary/40 hover:scale-110 transition-transform">
                  <Plus size={24} />
                </Button>
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2">
                {workouts[type].map((ex, index) => (
                  <div key={ex.id} className="exercise-card-enter" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ExerciseCard 
                      {...ex}
                      onEdit={() => { setEditingExercise(ex); setIsDialogOpen(true); }}
                      onDelete={() => handleDeleteExercise(ex.id)}
                      onUpdateStats={handleUpdateStats}
                    />
                  </div>
                ))}
                {workouts[type].length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">Nenhum exercício neste treino ainda.</p>
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
      <footer className="mt-12"><MadeWithDyad /></footer>
    </div>
  );
};

export default Index;