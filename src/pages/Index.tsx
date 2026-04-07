"use client";

import React from 'react';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exercises = [
  {
    id: '1',
    title: 'Supino Reto',
    videoUrl: 'https://www.youtube.com/watch?v=sqOw2Y6u9as',
    defaultReps: '4x10',
    defaultWeight: '60'
  },
  {
    id: '2',
    title: 'Agachamento Livre',
    videoUrl: 'https://www.youtube.com/watch?v=Uv_7S6-S-9w',
    defaultReps: '3x12',
    defaultWeight: '80'
  },
  {
    id: '3',
    title: 'Puxada na Frente',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    defaultReps: '4x12',
    defaultWeight: '45'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <WorkoutHeader />
      
      <main className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl p-1 bg-slate-200">
              <TabsTrigger value="today" className="rounded-lg font-semibold">Treino A</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg font-semibold">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Exercícios</h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                  {exercises.length} itens
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {exercises.map((ex) => (
                  <ExerciseCard 
                    key={ex.id}
                    id={ex.id}
                    title={ex.title}
                    videoUrl={ex.videoUrl}
                    defaultReps={ex.defaultReps}
                    defaultWeight={ex.defaultWeight}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="text-center py-12">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-slate-500 font-medium">Você ainda não completou treinos esta semana.</p>
                <p className="text-sm text-slate-400 mt-2">Seus resultados aparecerão aqui!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="mt-auto">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;