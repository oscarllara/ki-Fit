"use client";

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { Dumbbell, Trash2, ExternalLink, Phone, Mail, Calendar, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import ExerciseDialog from './ExerciseDialog';

interface StudentDetailsSheetProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsSheet = ({ student, isOpen, onClose }: StudentDetailsSheetProps) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('A');

  useEffect(() => {
    if (student && isOpen) {
      fetchExercises();
    }
  }, [student, isOpen]);

  const fetchExercises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', student.id)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });
    
    if (!error) setExercises(data || []);
    setLoading(false);
  };

  const deleteExercise = async (id: string) => {
    if (!confirm('Remover este exercício do aluno?')) return;
    const { error } = await supabase.from('exercises').delete().eq('id', id);
    if (!error) {
      showSuccess("Exercício removido");
      fetchExercises();
    } else {
      showError("Erro ao remover");
    }
  };

  const handleAddExercise = async (ex: any) => {
    const currentTypeExercises = exercises.filter(e => (e.workout_type || 'A') === (ex.workoutType || activeTab));
    const nextOrder = currentTypeExercises.length;

    const exerciseData = {
      title: ex.title,
      name: ex.title,
      video_url: ex.videoUrl,
      default_reps: ex.defaultReps,
      default_weight: ex.defaultWeight,
      user_id: student.id,
      workout_type: ex.workoutType || activeTab,
      order_index: nextOrder
    };
    
    const { error } = await supabase.from('exercises').insert([exerciseData]);
    if (!error) { 
      showSuccess("Treino adicionado!"); 
      fetchExercises();
      setIsAddDialogOpen(false);
    } else {
      showError("Erro ao salvar treino: " + error.message);
    }
  };

  const moveExercise = async (id: string, direction: 'up' | 'down') => {
    const type = exercises.find(ex => ex.id === id)?.workout_type || 'A';
    const typeExercises = exercises.filter(ex => (ex.workout_type || 'A') === type);
    const index = typeExercises.findIndex(ex => ex.id === id);

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === typeExercises.length - 1) return;

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const currentEx = typeExercises[index];
    const otherEx = typeExercises[otherIndex];

    try {
      // Atualiza os dois exercícios individualmente para evitar problemas com campos NOT NULL
      const { error: err1 } = await supabase
        .from('exercises')
        .update({ order_index: otherIndex })
        .eq('id', currentEx.id);

      const { error: err2 } = await supabase
        .from('exercises')
        .update({ order_index: index })
        .eq('id', otherEx.id);

      if (err1 || err2) throw new Error("Falha na atualização");

      fetchExercises();
    } catch (err) {
      showError("Erro ao reordenar");
    }
  };

  if (!student) return null;

  const filteredExercises = (type: string) => {
    return exercises.filter(ex => (ex.workout_type || 'A') === type);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto border-none shadow-2xl p-0">
          <div className="bg-slate-900 p-8 text-white rounded-b-[3rem]">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-white text-2xl font-black tracking-tighter">Perfil do Aluno</SheetTitle>
            </SheetHeader>
            
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-white/10">
                <AvatarImage src={student.avatar_url} className="object-cover" />
                <AvatarFallback className="bg-primary text-white text-2xl font-black">
                  {student.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-black">{student.full_name || 'Sem nome'}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-2 ${student.subscription_status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {student.subscription_status || 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={18} className="text-primary" />
                <span className="text-sm font-bold">{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={18} className="text-primary" />
                  <span className="text-sm font-bold">{student.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} className="text-primary" />
                <span className="text-sm font-bold">Mensalidade: R$ {Number(student.monthly_fee || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Dumbbell className="text-primary" size={20} /> Treinos
                  </h3>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)} 
                    size="sm" 
                    className="rounded-xl h-9 font-black text-[10px] uppercase tracking-widest"
                  >
                    <Plus size={14} className="mr-1" /> Add Treino
                  </Button>
                </div>

                <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl p-1 bg-slate-100 mb-6">
                  <TabsTrigger value="A" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary shadow-none">Treino A</TabsTrigger>
                  <TabsTrigger value="B" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary shadow-none">Treino B</TabsTrigger>
                  <TabsTrigger value="C" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary shadow-none">Treino C</TabsTrigger>
                </TabsList>

                {['A', 'B', 'C'].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-3 outline-none">
                    {loading ? (
                      <p className="text-center py-4 text-slate-400 font-bold">Carregando...</p>
                    ) : filteredExercises(type).length > 0 ? (
                      filteredExercises(type).map((ex, idx, arr) => (
                        <div key={ex.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary disabled:opacity-20"
                                onClick={() => moveExercise(ex.id, 'up')}
                                disabled={idx === 0}
                              >
                                <ChevronUp size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary disabled:opacity-20"
                                onClick={() => moveExercise(ex.id, 'down')}
                                disabled={idx === arr.length - 1}
                              >
                                <ChevronDown size={14} />
                              </Button>
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm">{ex.title || ex.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {ex.default_reps} • {ex.default_weight}kg
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {ex.video_url && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                                <a href={ex.video_url} target="_blank" rel="noreferrer"><ExternalLink size={14} /></a>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteExercise(ex.id)} className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-3xl">
                        <p className="text-slate-400 text-sm font-bold">Nenhum exercício no Treino {type}.</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ExerciseDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSave={handleAddExercise}
        defaultWorkoutType={activeTab}
      />
    </>
  );
};

export default StudentDetailsSheet;