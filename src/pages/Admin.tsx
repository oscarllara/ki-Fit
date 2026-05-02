"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Users, ShieldCheck, ArrowLeft, Plus, 
  TrendingUp, Wallet, AlertCircle, CheckCircle2, UserPlus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExerciseDialog from '@/components/ExerciseDialog';
import StudentDialog from '@/components/StudentDialog';
import { showSuccess, showError } from '@/utils/toast';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativo' | 'Inativo'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);

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
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('email', 'admin@admin.com'); // Não listar o próprio admin como aluno
    
    if (!error) {
      setUsers(data || []);
    } else {
      showError("Erro ao carregar dados: " + error.message);
    }
    setLoading(false);
  };

  const handleCreateStudent = async (formData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-student', {
        body: formData
      });

      if (error || data?.error) throw new Error(error?.message || data?.error);

      showSuccess(`Aluno ${formData.full_name} cadastrado com sucesso!`);
      fetchData();
    } catch (err: any) {
      showError("Erro ao cadastrar: " + err.message);
      throw err;
    }
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
      workout_type: 'A'
    }]);

    if (!error) {
      showSuccess(`Exercício adicionado para ${selectedUser.full_name}`);
      fetchData();
    } else {
      showError(error.message);
    }
  };

  const updateFinance = async (userId: string, status: string) => {
    const { error } = await supabase.from('profiles').update({ 
      subscription_status: status
    }).eq('id', userId);
    
    if (!error) {
      showSuccess("Status financeiro atualizado!");
      fetchData();
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableUsers = filteredUsers.filter(u => 
    statusFilter === 'all' ? true : (u.subscription_status || 'Inativo') === statusFilter
  );

  const totalPrevisto = users.reduce((acc, u) => acc + (Number(u.monthly_fee) || 0), 0);
  const totalRecebido = users.filter(u => u.subscription_status === 'Ativo').reduce((acc, u) => acc + (Number(u.monthly_fee) || 0), 0);
  const totalPendente = totalPrevisto - totalRecebido;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 rounded-2xl h-12 w-12 p-0">
                <ArrowLeft size={24} />
              </Button>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                Gestão Ki-Fit <ShieldCheck className="text-primary" />
              </h1>
            </div>
            <Button 
              onClick={() => setIsStudentDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6 shadow-lg shadow-primary/20"
            >
              <UserPlus size={18} className="mr-2" /> Novo Aluno
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <Users className="text-primary mb-2" size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Total Alunos</p>
              <p className="text-2xl md:text-3xl font-black">{users.length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <CheckCircle2 className="text-green-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Ativos</p>
              <p className="text-2xl md:text-3xl font-black">{users.filter(u => u.subscription_status === 'Ativo').length}</p>
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
                  placeholder="Buscar aluno..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-72 h-12 rounded-2xl bg-slate-50 border-none font-bold"
                />
              </div>

              <div className="grid gap-4">
                {loading ? (
                  <div className="py-20 text-center text-slate-400 font-bold">Carregando alunos...</div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                      <Button onClick={() => { setSelectedUser(user); setIsExerciseDialogOpen(true); }} className="rounded-xl font-black text-[10px] uppercase tracking-widest w-full md:w-auto">
                        <Plus size={14} className="mr-2" /> Add Treino
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-400 font-bold">Nenhum aluno cadastrado.</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`bg-white p-8 rounded-[2.5rem] shadow-xl border transition-all hover:scale-[1.02] text-left group ${statusFilter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-primary group-hover:text-white'}`}>
                  <TrendingUp size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Previsto</p>
                <p className="text-3xl font-black text-slate-800">R$ {totalPrevisto.toFixed(2)}</p>
              </button>

              <button 
                onClick={() => setStatusFilter('Ativo')}
                className={`bg-white p-8 rounded-[2.5rem] shadow-xl border transition-all hover:scale-[1.02] text-left group ${statusFilter === 'Ativo' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-slate-100'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${statusFilter === 'Ativo' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white'}`}>
                  <Wallet size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valores Recebidos</p>
                <p className="text-3xl font-black text-green-600">R$ {totalRecebido.toFixed(2)}</p>
              </button>

              <button 
                onClick={() => setStatusFilter('Inativo')}
                className={`bg-white p-8 rounded-[2.5rem] shadow-xl border transition-all hover:scale-[1.02] text-left group ${statusFilter === 'Inativo' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-100'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${statusFilter === 'Inativo' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                  <AlertCircle size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valores Pendentes</p>
                <p className="text-3xl font-black text-red-600">R$ {totalPendente.toFixed(2)}</p>
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800">Controle de Mensalidades</h2>
                {statusFilter !== 'all' && (
                  <Button variant="ghost" onClick={() => setStatusFilter('all')} className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Limpar Filtro
                  </Button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="pb-4">Aluno</th>
                      <th className="pb-4">Valor</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tableUsers.map((user) => (
                      <tr key={user.id} className="group">
                        <td className="py-4 font-bold text-slate-700">{user.full_name}</td>
                        <td className="py-4 font-black text-slate-800">R$ {Number(user.monthly_fee || 0).toFixed(2)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.subscription_status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {user.subscription_status || 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateFinance(user.id, 'Ativo')} className="rounded-lg text-[10px] font-black">PAGO</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateFinance(user.id, 'Inativo')} className="rounded-lg text-[10px] font-black">PENDENTE</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tableUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 font-bold">Nenhum aluno encontrado com este status.</td>
                      </tr>
                    )}
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

      <StudentDialog 
        isOpen={isStudentDialogOpen}
        onClose={() => setIsStudentDialogOpen(false)}
        onSave={handleCreateStudent}
      />
    </div>
  );
};

export default Admin;