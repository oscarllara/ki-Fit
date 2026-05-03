"use client";

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { Dumbbell, Trash2, ExternalLink, Phone, Mail, Calendar, Plus, Edit2, GripVertical } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import ExerciseDialog from './ExerciseDialog';

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StudentDetailsSheetProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

// Componente de Item Ordenável
const SortableExerciseItem = ({ ex, idx, onEdit, onDelete, isOverlay = false }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: ex.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  const content = (
    <div 
      className={`flex items-center justify-between p-4 bg-white rounded-2xl group border ${isOverlay ? 'border-primary shadow-2xl' : 'border-slate-100 shadow-sm'} hover:border-primary/20 transition-all`}
    >
      <div className="flex items-center gap-3">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-colors"
        >
          <GripVertical size={20} />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            <span className="text-primary font-black mr-1">#{idx + 1}</span>
            {ex.title || ex.name}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {ex.default_reps} • {ex.default_weight}kg
          </p>
        </div>
      </div>
      {!isOverlay && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(ex)} 
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
          >
            <Edit2 size={14} />
          </Button>
          {ex.video_url && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
              <a href={ex.video_url} target="_blank" rel="noreferrer"><ExternalLink size={14} /></a>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(ex.id)} className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );

  if (isOverlay) return content;

  return (
    <div ref={setNodeRef} style={style}>
      {content}
    </div>
  );
};

const StudentDetailsSheet = ({ student, isOpen, onClose }: StudentDetailsSheetProps) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('A');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleSaveExercise = async (ex: any) => {
    const exerciseData = {
      title: ex.title,
      name: ex.title,
      video_url: ex.videoUrl,
      default_reps: ex.defaultReps,
      default_weight: ex.defaultWeight,
      user_id: student.id,
      workout_type: ex.workoutType || activeTab,
    };

    try {
      if (editingExercise) {
        const { error } = await supabase
          .from('exercises')
          .update(exerciseData)
          .eq('id', editingExercise.id);
        if (error) throw error;
        showSuccess("Exercício atualizado!");
      } else {
        const currentTypeExercises = exercises.filter(e => (e.workout_type || 'A') === (ex.workoutType || activeTab));
        const nextOrder = currentTypeExercises.length;
        
        const { error } = await supabase
          .from('exercises')
          .insert([{ ...exerciseData, order_index: nextOrder }]);
        if (error) throw error;
        showSuccess("Treino adicionado!");
      }
      
      fetchExercises();
      setIsDialogOpen(false);
      setEditingExercise(null);
    } catch (err: any) {
      showError("Erro ao salvar: " + err.message);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const typeExercises = exercises.filter(ex => (ex.workout_type || 'A') === activeTab);
      const oldIndex = typeExercises.findIndex((ex) => ex.id === active.id);
      const newIndex = typeExercises.findIndex((ex) => ex.id === over.id);

      const reorderedTypeExercises = arrayMove(typeExercises, oldIndex, newIndex);
      
      // Atualiza o estado local imediatamente com a nova ordem e índices
      const updatedTypeExercises = reorderedTypeExercises.map((ex, idx) => ({
        ...ex,
        order_index: idx
      }));

      const newAllExercises = exercises.map(ex => {
        if ((ex.workout_type || 'A') === activeTab) {
          const found = updatedTypeExercises.find(u => u.id === ex.id);
          return found || ex;
        }
        return ex;
      }).sort((a, b) => {
        if (a.workout_type !== b.workout_type) return a.workout_type.localeCompare(b.workout_type);
        return a.order_index - b.order_index;
      });

      setExercises(newAllExercises);

      // Salva no banco de dados
      try {
        const updates = updatedTypeExercises.map((ex) => 
          supabase.from('exercises').update({ order_index: ex.order_index }).eq('id', ex.id)
        );
        await Promise.all(updates);
      } catch (err) {
        showError("Erro ao salvar nova ordem");
        fetchExercises();
      }
    }
  };

  if (!student) return null;

  const filteredExercises = (type: string) => {
    return exercises.filter(ex => (ex.workout_type || 'A') === type);
  };

  const activeExercise = activeId ? exercises.find(ex => ex.id === activeId) : null;

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
                    onClick={() => { setEditingExercise(null); setIsDialogOpen(true); }} 
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
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext 
                          items={filteredExercises(type).map(ex => ex.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {filteredExercises(type).map((ex, idx) => (
                              <SortableExerciseItem 
                                key={ex.id} 
                                ex={ex} 
                                idx={idx} 
                                onEdit={(exercise: any) => {
                                  setEditingExercise({ 
                                    ...exercise, 
                                    videoUrl: exercise.video_url, 
                                    defaultReps: exercise.default_reps, 
                                    defaultWeight: exercise.default_weight, 
                                    workoutType: exercise.workout_type 
                                  }); 
                                  setIsDialogOpen(true);
                                }}
                                onDelete={deleteExercise}
                              />
                            ))}
                          </div>
                        </SortableContext>
                        <DragOverlay dropAnimation={{
                          sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                              active: {
                                opacity: '0.5',
                              },
                            },
                          }),
                        }}>
                          {activeId ? (
                            <SortableExerciseItem 
                              ex={activeExercise} 
                              idx={filteredExercises(activeTab).findIndex(e => e.id === activeId)} 
                              isOverlay 
                            />
                          ) : null}
                        </DragOverlay>
                      </DndContext>
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
        isOpen={isDialogOpen} 
        onClose={() => { setIsDialogOpen(false); setEditingExercise(null); }} 
        onSave={handleSaveExercise}
        initialData={editingExercise}
        defaultWorkoutType={activeTab}
      />
    </>
  );
};

export default StudentDetailsSheet;