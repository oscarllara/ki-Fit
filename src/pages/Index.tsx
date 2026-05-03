"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDialog from '@/components/ExerciseDialog';
import ProfileDialog from '@/components/ProfileDialog';
import UserNav from '@/components/UserNav';
import RestTimer from '@/components/RestTimer';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, RefreshCw, Link as LinkIcon, Layers, Wallet, Calendar, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Exercise {
  id: string;
  title: string;
  video_url: string;
  default_reps: string;
  default_weight: string;
  level: number;
  completions: number;
  workout_type: string;
  order_index: number;
  superset_id?: string;
  is_time_based?: boolean;
}

type WorkoutType = 'A' | 'B' | 'C' | 'financeiro';

const Index = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Record<string, Exercise[]>>({ A: [], B: [], C: [] });
  const [activeTab, setActiveTab] = useState<WorkoutType>('A');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;

      const organized: Record<string, Exercise[]> = { A: [], B: [], C: [] };
      if (data) {
        data.forEach((ex: any) => {
          const type = ex.workout_type || 'A';
          if (!organized[type]) organized[type] = [];
          organized[type].push(ex);
        });
      }
      setWorkouts(organized);
    } catch (err: any) {
      showError("Erro ao carregar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { navigate('/login'); return; }
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      setUser({ ...authUser, ...profile });
      fetchExercises(authUser.id);
    };
    checkUser();
  }, [navigate]);

  const handleUpdateStats = async (id: string, completions: number, level: number) => {
    try {
      const { error } = await supabase.from('exercises').update({ completions, level }).eq('id', id);
      if (error) throw error;
      setShowTimer(true);
      fetchExercises(user.id);
    } catch (err: any) {
      showError("Erro ao atualizar");
    }
  };

  const handleDuplicate = async (ex: Exercise) => {
    try {
      const { id, created_at, ...rest } = ex as any;
      const { error } = await supabase.from('exercises').insert([{
        ...rest,
        order_index: (workouts[activeTab] || []).length,
        completions: 0,
        level: 1
      }]);
      
      if (error) throw error;
      showSuccess("Exercício duplicado!");
      fetchExercises(user.id);
    } catch (err: any) {
      showError("Erro ao duplicar");
    }
  };

  const renderWorkoutContent = (type: string) => {
    const list = workouts[type] || [];
    const rendered: React.ReactNode[] = [];
    let i = 0;

    while (i < list.length) {
      const current = list[i];
      
      if (current.superset_id) {
        const group = [current];
        let j = i + 1;
        while (j < list.length && list[j].superset_id === current.superset_id) {
          group.push(list[j]);
          j++;
        }

        const groupType = group.length === 2 ? 'BI-SET' : group.length === 3 ? 'TRI-SET' : 'CIRCUITO';

        rendered.push(
          <div key={`group-${current.superset_id}`} className="col-span-full bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] p-4 md:p-6 space-y-6 relative mt-4">
            <div className="absolute -top-4 left-8 bg-primary text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl z-10">
              <Layers size={14} /> {groupType} INTERCALADO
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {group.map((ex, gIdx) => (
                <ExerciseCard 
                  key={ex.id}
                  {...ex}
                  orderNumber={i + gIdx + 1}
                  videoUrl={ex.video_url}
                  defaultReps={ex.default_reps}
                  defaultWeight={ex.default_weight}
                  isTimeBased={ex.is_time_based}
                  onEdit={() => { setEditingExercise(ex); setIsDialogOpen(true); }}
                  onDelete={async () => { if(confirm('Excluir?')) { await supabase.from('exercises').delete().eq('id', ex.id); fetchExercises(user.id); } }}
                  onDuplicate={() => handleDuplicate(ex)}
                  onUpdateStats={handleUpdateStats}
                />
              ))}
            </div>
          </div>
        );
        i = j;
      } else {
        rendered.push(
          <div key={current.id} className="exercise-card-enter">
            <ExerciseCard 
              {...current}
              orderNumber={i + 1}
              videoUrl={current.video_url}
              defaultReps={current.default_reps}
              defaultWeight={current.default_weight}
              isTimeBased={current.is_time_based}
              onEdit={() => { setEditingExercise(current); setIsDialogOpen(true); }}
              onDelete={async () => { if(confirm('Excluir?')) { await supabase.from('exercises').delete().eq('id', current.id); fetchExercises(user.id); } }}
              onDuplicate={() => handleDuplicate(current)}
              onUpdateStats={handleUpdateStats}
            />
          </div>
        );
        i++;
      }
    }
    return rendered;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white">
      <UserNav user={user} onLogout={async () => { await supabase.auth.signOut(); navigate('/login'); }} onAdmin={() => navigate('/admin')} onProfileUpdate={() => setIsProfileOpen(true)} isAdmin={user?.email === 'admin@admin.com'} />
      <WorkoutHeader />
      
      <main className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <Tabs defaultValue="A" onValueChange={(v) => setActiveTab(v as WorkoutType)} className="w-full">
          <div className="sticky top-6 z-30 bg-slate-950/80 backdrop-blur-xl py-4 mb-8 rounded-[2rem] px-2">
            <TabsList className="grid w-full grid-cols-4 h-16 rounded-[1.5rem] p-2 bg-white/5 shadow-2xl border border-white/10">
              <TabsTrigger value="A" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">Treino A</TabsTrigger>
              <TabsTrigger value="B" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">Treino B</TabsTrigger>
              <TabsTrigger value="C" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">Treino C</TabsTrigger>
              <TabsTrigger value="financeiro" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">
                <Wallet size={14} className="mr-2" /> Pagto
              </TabsTrigger>
            </TabsList>
          </div>
          
          {(['A', 'B', 'C'] as const).map((type) => (
            <TabsContent key={type} value={type} className="space-y-8 outline-none">
              <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={18} className="fill-primary/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sua Jornada</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Exercícios do Dia</h2>
                </div>
                <Button onClick={() => { setEditingExercise(null); setIsDialogOpen(true); }} size="lg" className="rounded-full h-14 w-14 p-0 shadow-2xl shadow-primary/20 bg-primary text-slate-950 hover:bg-primary/90"><Plus size={24} /></Button>
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2">
                {renderWorkoutContent(type)}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="financeiro" className="space-y-8 outline-none">
            <div className="px-2 space-y-1 mb-8">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financeiro</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Minha Assinatura</h2>
            </div>

            <div className="grid gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Wallet size={120} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Atual</p>
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase ${user?.payment_status === 'Pago' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {user?.payment_status === 'Pago' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {user?.payment_status || 'Pendente'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mensalidade</p>
                      <p className="text-3xl font-black text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user?.monthly_fee || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <Calendar className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vencimento</p>
                        <p className="font-black">Dia {user?.due_day || 10}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <RefreshCw className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Último Pagto</p>
                        <p className="font-black">
                          {user?.last_payment_date ? format(new Date(user.last_payment_date), 'dd/MM/yy') : '---'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] flex items-center gap-4">
                <div className="bg-primary p-3 rounded-2xl">
                  <AlertCircle className="text-slate-950" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Dúvidas sobre pagamentos?</p>
                  <p className="text-xs text-slate-400">Fale diretamente com seu gestor no WhatsApp.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      
      <ExerciseDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={async (ex) => {
          const data = { 
            title: ex.title, 
            name: ex.title, 
            video_url: ex.videoUrl, 
            default_reps: ex.defaultReps, 
            default_weight: ex.defaultWeight, 
            user_id: user.id, 
            workout_type: activeTab === 'financeiro' ? 'A' : activeTab,
            is_time_based: ex.isTimeBased
          };
          if (editingExercise) await supabase.from('exercises').update(data).eq('id', editingExercise.id);
          else await supabase.from('exercises').insert([{ ...data, order_index: (workouts[activeTab] || []).length }]);
          fetchExercises(user.id); setIsDialogOpen(false);
        }} 
        initialData={editingExercise ? { ...editingExercise, videoUrl: editingExercise.video_url, defaultReps: editingExercise.default_reps, defaultWeight: editingExercise.default_weight, isTimeBased: editingExercise.is_time_based } : null} 
      />
      
      <ProfileDialog 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onSave={async (data) => { 
          await supabase.from('profiles').upsert({ id: user.id, ...data }); 
          setUser(prev => ({ ...prev, ...data })); 
          showSuccess("Perfil atualizado!"); 
        }} 
        initialData={user} 
      />
      
      <footer className="mt-12 opacity-50"><MadeWithDyad /></footer>
    </div>
  );
};

export default Index;