"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Users, Dumbbell, TrendingUp, ArrowLeft, Search, ShieldCheck, 
  ChevronRight, BarChart3, Activity, DollarSign, Calendar, Plus, Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExerciseDialog from '@/components/ExerciseDialog';
import { showSuccess, showError } from '@/utils/toast';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@admin.com') {
        navigate('/');
        return;
      }
      fetchData();
    };
    checkAdmin();
  }, [navigate]);

  const fetchData = async () => {
    const [usersRes, exercisesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('exercises').select('*')
    ]);
    if (!usersRes.error) setUsers(usersRes.data || []);
    if (!exercisesRes.error) setExercises(exercisesRes.data || []);
    setLoading(false);
  };

  const handleAddExerciseToUser = async (exercise: any) => {
    if (!selectedUser) return;
    const { error } = await supabase.from('exercises').insert([{
      title: exercise.title,
      name: exercise.title,
      video_url: exercise.videoUrl,
      default_reps: exercise.defaultReps,
      default_weight: exercise.defaultWeight,
      user_id: selectedUser.id,
      workout_type: 'A' // Padrão
    }]);

    if (!error) {
      showSuccess(`Exercício adicionado para ${selectedUser.full_name}`);
      fetchData();
    } else {
      showError(error.message);
    }
  };

  const updateFinance = async (userId: string, status: string, date: string) => {
    const { error } = await supabase.from('profiles').update({ 
      subscription_status: status,
      due_date: date 
    }).eq('id', userId);
    
    if (!error) {
      showSuccess("Financeiro atualizado!");
      fetchData();
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 rounded-2xl h-12 w-12 p-0">
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              Gestão Ki-Fit <ShieldCheck className="text-primary" />
            </h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <Users className="text-primary mb-2" size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Alunos</p>
              <p className="text-3xl font-black">{users.length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <DollarSign className="text-green-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Ativos</p>
              <p className="text-3xl font-black">{users.filter(u => u.subscription_status === 'Ativo').length}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <Tabs defaultValue="alunos" className="w-full">
          <TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-100 mb-8 h-14">
            <TabsTrigger value="alunos" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-8">Alunos</TabsTrigger>
            <TabsTrigger value="financeiro" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-8">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="alunos" className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-black text-slate-800">Gestão de Alunos</h2>
                <Input 
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-72 h-12 rounded-2xl bg-slate-50 border-none font-bold"
                />
              </div>

              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
                        {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : user.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800">{user.full_name}</h3>
                        <p className="text-xs font-bold text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => { setSelectedUser(user); setIsExerciseDialogOpen(true); }} className="rounded-xl font-black text-[10px] uppercase tracking-widest">
                        <Plus size={14} className="mr-2" /> Add Treino
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-8">Controle de Mensalidades</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="pb-4">Aluno</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Vencimento</th>
                      <th className="pb-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group">
                        <td className="py-4 font-bold text-slate-700">{user.full_name}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.subscription_status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {user.subscription_status || 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-bold text-slate-500">{user.due_date || 'Não definido'}</td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateFinance(user.id, 'Ativo', '2024-12-30')} className="rounded-lg text-[10px] font-black">ATIVAR</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateFinance(user.id, 'Inativo', '')} className="rounded-lg text-[10px] font-black">BLOQUEAR</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ExerciseDialog 
        isOpen={isExerciseDialogOpen} 
        onClose={() => setIsExerciseDialogOpen(false)} 
        onSave={handleAddExerciseToUser}
      />
    </div>
  );
};

export default Admin;