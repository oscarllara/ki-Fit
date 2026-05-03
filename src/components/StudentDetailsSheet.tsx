"use client";

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { Dumbbell, Trash2, ExternalLink, Phone, Mail, Calendar, Plus, Edit2, GripVertical, Link as LinkIcon, Unlink, Layers } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import ExerciseDialog from './ExerciseDialog';
import { Checkbox } from "@/components/ui/checkbox";

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

const SortableExerciseItem = ({ ex, idx, onEdit, onDelete, isOverlay = false, isSelected, onSelect, isPartOfGroup = false }: any) => {
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
      className={`flex items-center justify-between p-4 bg-white rounded-2xl group border ${isOverlay ? 'border-primary shadow-2xl' : isPartOfGroup ? 'border-none' : 'border-slate-100 shadow-sm'} hover:bg-slate-50/50 transition-all`}
    >
      <div className="flex items-center gap-3">
        {!isOverlay && (
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => onSelect(ex.id)}
            className="rounded-md border-slate-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        )}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-colors"
        >
          <GripVertical size={20} />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            {!isPartOfGroup && <span className="text-primary font-black mr-1">#{idx + 1}</span>}
            {ex.title || ex.name}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {ex.default_reps} • {ex.default_weight}kg
          </p>
        </div>
      </div>
      {!isOverlay && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(ex)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary">
            <Edit2 size={14} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(ex.id)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50">
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );

  if (isOverlay) return content;
  return <div ref={setNodeRef} style={style}>{content}</div>;
};

const StudentDetailsSheet = ({ student, isOpen, onClose }: StudentDetailsSheetProps) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('A');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (student && isOpen) fetchExercises();
  }, [student, isOpen]);

  const fetchExercises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', student.id)
      .order('order_index', { ascending: true });
    if (!error) setExercises(data || []);
    setLoading(false);
  };

  const handleGroup = async () => {
    if (selectedIds.length < 2) return;
    const supersetId = crypto.randomUUID();
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ superset_id: supersetId })
        .in('id', selectedIds);
      if (error) throw error;
      showSuccess("Exercícios agrupados!");
      setSelectedIds([]);
      fetchExercises();
    } catch (err) {
      showError("Erro ao agrupar");
    }
  };

  const handleUngroup = async () => {
    if (selectedIds.length === 0) return;
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ superset_id: null })
        .in('id', selectedIds);
      if (error) throw error;
      showSuccess("Agrupamento removido!");
      setSelectedIds([]);
      fetchExercises();
    } catch (err) {
      showError("Erro ao desagrupar");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const typeExercises = exercises.filter(ex => (ex.workout_type || 'A') === activeTab);
      const oldIndex = typeExercises.findIndex((ex) => ex.id === active.id);
      const newIndex = typeExercises.findIndex((ex) => ex.id === over.id);
      const reordered = arrayMove(typeExercises, oldIndex, newIndex);
      const updated = reordered.map((ex, idx) => ({ ...ex, order_index: idx }));
      
      setExercises(prev => prev.map(ex => {
        if ((ex.workout_type || 'A') === activeTab) {
          return updated.find(u => u.id === ex.id) || ex;
        }
        return ex;
      }).sort((a, b) => a.order_index - b.order_index));

      try {
        const updates = updated.map(ex => supabase.from('exercises').update({ order_index: ex.order_index }).eq('id', ex.id));
        await Promise.all(updates);
      } catch (err) {
        fetchExercises();
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveExercise = async (ex: any) => {
    const data: any = { 
      title: ex.title, 
      name: ex.title, 
      video_url: ex.videoUrl, 
      default_reps: ex.defaultReps, 
      default_weight: ex.defaultWeight, 
      user_id: student.id, 
      workout_type: ex.workoutType || activeTab 
    };

    if (editingExercise) {
      await supabase.from('exercises').update(data).eq('id', editingExercise.id);
    } else {
      const typeExercises = exercises.filter(e => (e.workout_type || 'A') === (ex.workoutType || activeTab));
      data.order_index = typeExercises.length;

      // Lógica de agrupamento automático
      if (ex.groupWithPrevious && typeExercises.length > 0) {
        const lastEx = typeExercises[typeExercises.length - 1];
        if (lastEx.superset_id) {
          data.superset_id = lastEx.superset_id;
        } else {
          const newSupersetId = crypto.randomUUID();
          // Atualiza o anterior para ter o mesmo ID
          await supabase.from('exercises').update({ superset_id: newSupersetId }).eq('id', lastEx.id);
          data.superset_id = newSupersetId;
        }
      }
      
      await supabase.from('exercises').insert([data]);
    }
    
    fetchExercises();
    setIsDialogOpen(false);
    setEditingExercise(null);
  };

  if (!student) return null;
  
  const filtered = exercises.filter(ex => (ex.workout_type || 'A') === activeTab);

  const renderExerciseList = () => {
    const rendered: React.ReactNode[] = [];
    let i = 0;

    while (i < filtered.length) {
      const current = filtered[i];
      
      if (current.superset_id) {
        const group = [current];
        let j = i + 1;
        while (j < filtered.length && filtered[j].superset_id === current.superset_id) {
          group.push(filtered[j]);
          j++;
        }

        const groupType = group.length === 2 ? 'BI-SET' : group.length === 3 ? 'TRI-SET' : 'CIRCUITO';

        rendered.push(
          <div key={`group-${current.superset_id}`} className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-[2.5rem] p-2 space-y-1 relative">
            <div className="absolute -top-3 left-6 bg-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg z-10">
              <Layers size={10} /> {groupType}
            </div>
            {group.map((ex, gIdx) => (
              <SortableExerciseItem 
                key={ex.id} ex={ex} idx={i + gIdx} 
                isSelected={selectedIds.includes(ex.id)}
                onSelect={toggleSelect}
                isPartOfGroup={true}
                onEdit={(e: any) => { setEditingExercise({...e, videoUrl: e.video_url, defaultReps: e.default_reps, defaultWeight: e.default_weight}); setIsDialogOpen(true); }}
                onDelete={async (id: string) => { if(confirm('Excluir?')) { await supabase.from('exercises').delete().eq('id', id); fetchExercises(); } }}
              />
            ))}
          </div>
        );
        i = j;
      } else {
        rendered.push(
          <SortableExerciseItem 
            key={current.id} ex={current} idx={i} 
            isSelected={selectedIds.includes(current.id)}
            onSelect={toggleSelect}
            onEdit={(e: any) => { setEditingExercise({...e, videoUrl: e.video_url, defaultReps: e.default_reps, defaultWeight: e.default_weight}); setIsDialogOpen(true); }}
            onDelete={async (id: string) => { if(confirm('Excluir?')) { await supabase.from('exercises').delete().eq('id', id); fetchExercises(); } }}
          />
        );
        i++;
      }
    }
    return rendered;
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
                <AvatarFallback className="bg-primary text-white text-2xl font-black">{student.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-black">{student.full_name}</h2>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-2 bg-green-500/20 text-green-400">{student.subscription_status}</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Dumbbell className="text-primary" size={20} /> Treinos</h3>
                  <div className="flex gap-2">
                    {selectedIds.length > 0 && (
                      <>
                        <Button onClick={handleUngroup} variant="outline" size="sm" className="rounded-xl h-9 font-black text-[10px] uppercase border-red-100 text-red-500 hover:bg-red-50">
                          <Unlink size={14} className="mr-1" /> Desagrupar
                        </Button>
                        <Button onClick={handleGroup} disabled={selectedIds.length < 2} size="sm" className="rounded-xl h-9 font-black text-[10px] uppercase">
                          <LinkIcon size={14} className="mr-1" /> Agrupar
                        </Button>
                      </>
                    )}
                    <Button onClick={() => { setEditingExercise(null); setIsDialogOpen(true); }} size="sm" className="rounded-xl h-9 font-black text-[10px] uppercase">
                      <Plus size={14} className="mr-1" /> Add
                    </Button>
                  </div>
                </div>

                <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl p-1 bg-slate-100 mb-6">
                  <TabsTrigger value="A" className="rounded-lg font-black text-[10px] uppercase">Treino A</TabsTrigger>
                  <TabsTrigger value="B" className="rounded-lg font-black text-[10px] uppercase">Treino B</TabsTrigger>
                  <TabsTrigger value="C" className="rounded-lg font-black text-[10px] uppercase">Treino C</TabsTrigger>
                </TabsList>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
                  <SortableContext items={filtered.map(ex => ex.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {renderExerciseList()}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? <SortableExerciseItem ex={exercises.find(e => e.id === activeId)} idx={filtered.findIndex(e => e.id === activeId)} isOverlay /> : null}
                  </DragOverlay>
                </DndContext>
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