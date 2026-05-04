"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import WorkoutHeader from '@/components/WorkoutHeader';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDialog from '@/components/ExerciseDialog';
import ProfileDialog from '@/components/ProfileDialog';
import PaymentDialog from '@/components/PaymentDialog';
import UserNav from '@/components/UserNav';
import RestTimer from '@/components/RestTimer';
import ProgressStats from '@/components/ProgressStats';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, RefreshCw, Link as LinkIcon, Layers, Wallet, Calendar, CheckCircle2, AlertCircle, TrendingUp, ArrowRight, Play, Square } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';

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
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedInSession, setCompletedInSession] = useState<string[]>([]);

  useEffect(() => {
    let interval: any;
    if (isWorkoutActive && workoutStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, workoutStartTime]);

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

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(Date.now());
    setElapsedTime(0);
    setCompletedInSession([]);
    showSuccess("Treino iniciado! Foco total! 💪");
  };

  const handleFinishWorkout = () => {
    setIsWorkoutActive(false);
    const duration = formatTime(elapsedTime);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b8ff00', '#ffffff', '#000000']
    });
    showSuccess(`Treino finalizado em ${duration}! Você é fera! 🚀`);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).filter((v, i) => v !== '00' || i > 0).join(':');
  };

  const handleUpdateStats = async (id: string, completions: number, level: number) => {
    try {
      const { error } = await supabase.from('exercises').update({ completions, level }).eq('id', id);
      if (error) throw error;
      
      if (isWorkoutActive) {
        setCompletedInSession(prev => [...prev, id]);
        const currentWorkoutList = workouts[activeTab] || [];
        if (completedInSession.length + 1 === currentWorkoutList.length) {
          handleFinishWorkout();
        }
      }

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

  const calculateStats = () => {
    const allExercises = Object.values(workouts).flat();
    const totalCompletions = allExercises.reduce((acc, ex) => acc + (ex.completions || 0), 0);
    const averageLevel = allExercises.length > 0 
      ? allExercises.reduce((acc, ex) => acc + (ex.level || 1), 0) / allExercises.length 
      : 1;
    return { totalCompletions, averageLevel, workoutCount: allExercises.length };
  };

  const stats = calculateStats();

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
          <div key={`group-${current.superset_id}`} className="col-span-full bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 space-y-6 relative mt-4">
            <div className="absolute -top-4 left-4 md:left-8 bg-primary text-slate-950 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl z-10">
              <Layers size={12} className="md:w-3.5 md:h-3.5" /> {groupType} INTERCALADO
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
      
      <main className="max-w-4xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16 relative z-20">
        <ProgressStats {...stats} />

        <Tabs defaultValue="A" onValueChange={(v) => setActiveTab(v as WorkoutType)} className="w-full">
          <div className="sticky top-4 md:top-6 z-30 bg-slate-950/80 backdrop-blur-xl py-3 md:py-4 mb-6 md:mb-8 rounded-[1.5rem] md:rounded-[2rem] px-1 md:px-2">
            <TabsList className="grid w-full grid-cols-4 h-14 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] p-1.5 md:p-2 bg-white/5 shadow-2xl border border-white/10">
              <TabsTrigger value="A" className="rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">Treino A</TabsTrigger>
              <TabsTrigger value="B" className="rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">Treino B</TabsTrigger>
              <TabsTrigger value="C" className="rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">Treino C</TabsTrigger>
              <TabsTrigger value="financeiro" className="rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-slate-950">
                <Wallet size={12} className="mr-1 md:mr-2" /> Pagto
              </TabsTrigger>
            </TabsList>
          </div>
          
          {(['A', 'B', 'C'] as const).map((type) => (
            <TabsContent key={type} value={type} className="space-y-6 md:space-y-8 outline-none">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-1 md:px-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={16} className="fill-primary/20" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Sua Jornada</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Exercícios do Dia</h2>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {!isWorkoutActive ? (
                    <Button 
                      onClick={handleStartWorkout}
                      className="flex-1 md:flex-none h-12 md:h-14 rounded-xl md:rounded-2xl bg-primary text-slate-950 font-black uppercase text-[10px] md:text-xs tracking-widest px-6 md:px-8 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      <Play size={16} className="mr-2 fill-slate-950" /> Iniciar Treino
                    </Button>
                  ) : (
                    <div className="flex-1 md:flex-none flex items-center gap-2 md:gap-3 bg-white/5 p-1 rounded-xl md:rounded-2xl border border-white/10">
                      <div className="px-3 md:px-4 py-1 md:py-2">
                        <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Tempo</p>
                        <p className="text-lg md:text-xl font-black tabular-nums text-primary">{formatTime(elapsedTime)}</p>
                      </div>
                      <Button 
                        onClick={handleFinishWorkout}
                        variant="destructive"
                        className="h-10 md:h-12 rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest px-3 md:px-4"
                      >
                        <Square size={14} className="mr-1 md:mr-2 fill-white" /> Parar
                      </Button>
                    </div>
                  )}
                  <Button onClick={() => { setEditingExercise(null); setIsDialogOpen(true); }} size="lg" className="rounded-xl md:rounded-2xl h-12 md:h-14 w-12 md:w-14 p-0 shadow-2xl shadow-white/5 bg-white/5 border border-white/10 text-white hover:bg-white/10"><Plus size={20} md:size={24} /></Button>
                </div>
              </div>
              
              <div className="grid gap-6 md:gap-8 sm:grid-cols-2">
                {renderWorkoutContent(type)}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="financeiro" className="space-y-6 md:space-y-8 outline-none">
            <div className="px-1 md:px-2 space-y-1 mb-6 md:mb-8">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp size={18} />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Financeiro</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Minha Assinatura</h2>
            </div>

            <div className="grid gap-6">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
                  <Wallet size={120} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Atual</p>
                      <div className={`flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase ${user?.payment_status === 'Pago' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {user?.payment_status === 'Pago' ? <CheckCircle2 size={12} md:size={14} /> : <AlertCircle size={12} md:size={14} />}
                        {user?.payment_status || 'Pendente'}
                      </div>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mensalidade</p>
                      <p className="text-2xl md:text-3xl font-black text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user?.monthly_fee || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-white/5 p-2 md:p-3 rounded-xl md:rounded-2xl">
                        <Calendar className="text-primary" size={18} md:size={20} />
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Vencimento</p>
                        <p className="text-xs md:text-base font-black">Dia {user?.due_day || 10}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-white/5 p-2 md:p-3 rounded-xl md:rounded-2xl">
                        <RefreshCw className="text-primary" size={18} md:size={20} />
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Último Pagto</p>
                        <p className="text-xs md:text-base font-black">
                          {user?.last_payment_date ? format(new Date(user.last_payment_date), 'dd/MM/yy') : '---'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsPaymentOpen(true)}
                    className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20 mt-4"
                  >
                    Pagar Agora <ArrowRight className="ml-2" size={16} md:size={18} />
                  </Button>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4">
                <div className="bg-primary p-2 md:p-3 rounded-xl md:rounded-2xl shrink-0">
                  <AlertCircle className="text-slate-950" size={20} md:size={24} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-white">Dúvidas sobre pagamentos?</p>
                  <p className="text-[10px] md:text-xs text-slate-400">Fale diretamente com seu gestor no WhatsApp.</p>
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

      <PaymentDialog 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        userId={user?.id} 
        monthlyFee={user?.monthly_fee || 0} 
      />
      
      <footer className="mt-12 opacity-50"><MadeWithDyad /></footer>
    </div>
  );
};

export default Index;