"use client";

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { Dumbbell, Trash2, ExternalLink, Phone, Mail, Calendar } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface StudentDetailsSheetProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsSheet = ({ student, isOpen, onClose }: StudentDetailsSheetProps) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      .order('created_at', { ascending: false });
    
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

  if (!student) return null;

  return (
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Dumbbell className="text-primary" size={20} /> Treino Atual
              </h3>
              <span className="text-[10px] font-black uppercase text-slate-400">{exercises.length} Exercícios</span>
            </div>

            <div className="grid gap-3">
              {loading ? (
                <p className="text-center py-4 text-slate-400 font-bold">Carregando treino...</p>
              ) : exercises.length > 0 ? (
                exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                    <div>
                      <p className="font-black text-slate-800 text-sm">{ex.title || ex.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {ex.default_reps} • {ex.default_weight}kg
                      </p>
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
                  <p className="text-slate-400 text-sm font-bold">Nenhum exercício cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StudentDetailsSheet;