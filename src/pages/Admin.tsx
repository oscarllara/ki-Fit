"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Users, ShieldCheck, ArrowLeft, Plus, 
  TrendingUp, Wallet, AlertCircle, CheckCircle2, UserPlus, RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExerciseDialog from '@/components/ExerciseDialog';
import StudentDialog from '@/components/StudentDialog';
import StudentDetailsSheet from '@/components/StudentDetailsSheet';
import { showSuccess, showError } from '@/utils/toast';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativo' | 'Inativo'>('all');
  const [activeTab, setActiveTab] = useState('alunos');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
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
    try {
      const { data, error } = await supabase.functions.invoke('admin-get-users');
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      showError("Erro ao carregar alunos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-profiles');
      if (error) throw error;
      showSuccess(`${data.synced} perfis sincronizados!`);
      fetchData();
    } catch (err: any) {
      showError("Erro na sincronização: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateStudent = async (formData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-student', {
        body: formData
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      showSuccess(`Aluno ${formData.full_name} cadastrado!`);
      fetchData();
    } catch (err: any) {
      showError("Erro: " + err.message);
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
      showSuccess(`Exercício adicionado!`);
      fetchData();
    }
  };

  const updateFinance = async (userId: string, status: string) => {
    // Atualização Otimista: atualiza a UI instantaneamente
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription_status: status } : u));

    const { error } = await supabase.from('profiles').update({ 
      subscription_status: status
    }).eq('id', userId);

    if (error) {
      showError("Erro ao atualizar status");
      fetchData(); // Rollback em caso de erro
    } else {
      showSuccess(status === 'Ativo' ? "Pagamento confirmado!" : "Status pendente!");
    }
  };

  const updateMonthlyFee = async (userId: string, fee: string) => {
    // Converte formato brasileiro (0,00) para número
    const cleanValue = fee.replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const val = parseFloat(cleanValue);
    
    if (isNaN(val)) return;

    // Atualização Otimista
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, monthly_fee: val } : u));

    const { error } = await supabase.from('profiles').update({ 
      monthly_fee: val
    }).eq('id', userId);
    
    if (error) {
      showError("Erro ao atualizar valor");
      fetchData(); // Rollback
    } else {
      showSuccess("Valor atualizado!");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const applyFilter = (filter: 'all' | 'Ativo' | 'Inativo', tab?: string) => {
    setStatusFilter(filter);
    if (tab) setActiveTab(tab);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name || u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : (u.subscription_status || 'Inativo') === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={handleSync}
                disabled={syncing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-4"
              >
                <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} /> Sincronizar
              </Button>
              <Button 
                onClick={() => setIsStudentDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-lg shadow-primary/20"
              >
                <UserPlus size={18} className="mr-2" /> Novo Aluno
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => applyFilter('all', 'alunos')}
              className={`p-6 rounded-[2rem] border transition-all text-left ${statusFilter === 'all' && activeTab === 'alunos' ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <Users className={statusFilter === 'all' && activeTab === 'alunos' ? 'text-white mb-2' : 'text-primary mb-2'} size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Total Alunos</p>
              <p className="text-2xl md:text-3xl font-black">{users.length}</p>
            </button>
            <button 
              onClick={() => applyFilter('Ativo', 'alunos')}
              className={`p-6 rounded-[2rem] border transition-all text-left ${statusFilter === 'Ativo' && activeTab === 'alunos' ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <CheckCircle2 className={statusFilter === 'Ativo' && activeTab === 'alunos' ? 'text-white mb-2' : 'text-green-400 mb-2'} size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Ativos</p>
              <p className="text-2xl md:text-3xl font-black">{users.filter(u => u.subscription_status === 'Ativo').length}</p>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-100 mb-8 h-14">
            <TabsTrigger value="alunos" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-8">Alunos</TabsTrigger>
            <TabsTrigger value="financeiro" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-8">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="alunos" className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-slate-800">Gestão de Alunos</h2>
                  {statusFilter !== 'all' && (
                    <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                      Limpar Filtro
                    </Button>
                  )}
                </div>
                <Input 
                  placeholder="Buscar por nome ou e-mail..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-72 h-12 rounded-2xl bg-slate-50 border-none font-bold"
                />
              </div>

              <div className="grid gap-4">
                {loading ? (
                  <div className="py-20 text-center text-slate-400 font-bold">Carregando...</div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl gap-4">
                      <button 
                        onClick={() => setViewingUser(user)}
                        className="flex items-center gap-4 w-full md:w-auto text-left hover:opacity-80 transition-opacity"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
                          {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : (user.full_name?.charAt(0) || '?')}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800">{user.full_name || 'Usuário sem nome'}</h3>
                          <p className="text-xs font-bold text-slate-400">{user.email || 'E-mail não sincronizado'}</p>
                        </div>
                      </button>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => updateFinance(user.id, user.subscription_status === 'Ativo' ? 'Inativo' : 'Ativo')}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:scale-105 ${user.subscription_status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                        >
                          {user.subscription_status || 'Inativo'}
                        </button>
                        <Button onClick={() => { setSelectedUser(user); setIsExerciseDialogOpen(true); }} className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 md:flex-none">
                          <Plus size={14} className="mr-2" /> Add Treino
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-400 font-bold">Nenhum aluno encontrado.</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => applyFilter('all')} 
                className={`p-8 rounded-[2.5rem] shadow-xl border transition-all text-left ${statusFilter === 'all' ? 'bg-white border-primary ring-4 ring-primary/10' : 'bg-white border-slate-100 hover:border-primary/30'}`}
              >
                <TrendingUp className="text-blue-600 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase text-slate-400">Total Previsto</p>
                <p className="text-3xl font-black text-slate-800">{formatCurrency(totalPrevisto)}</p>
              </button>
              <button 
                onClick={() => applyFilter('Ativo')} 
                className={`p-8 rounded-[2.5rem] shadow-xl border transition-all text-left ${statusFilter === 'Ativo' ? 'bg-white border-green-500 ring-4 ring-green-500/10' : 'bg-white border-slate-100 hover:border-green-500/30'}`}
              >
                <Wallet className="text-green-600 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase text-slate-400">Recebidos</p>
                <p className="text-3xl font-black text-green-600">{formatCurrency(totalRecebido)}</p>
              </button>
              <button 
                onClick={() => applyFilter('Inativo')} 
                className={`p-8 rounded-[2.5rem] shadow-xl border transition-all text-left ${statusFilter === 'Inativo' ? 'bg-white border-red-500 ring-4 ring-red-500/10' : 'bg-white border-slate-100 hover:border-red-500/30'}`}
              >
                <AlertCircle className="text-red-600 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase text-slate-400">Pendentes</p>
                <p className="text-3xl font-black text-red-600">{formatCurrency(totalPendente)}</p>
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800">Controle de Mensalidades</h2>
                {statusFilter !== 'all' && (
                  <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')} className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Ver Todos
                  </Button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="pb-4">Aluno</th>
                      <th className="pb-4">Valor (R$)</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group">
                        <td className="py-4">
                          <button onClick={() => setViewingUser(user)} className="font-bold text-slate-700 hover:text-primary transition-colors">
                            {user.full_name || user.email}
                          </button>
                        </td>
                        <td className="py-4">
                          <div className="relative w-32">
                            <Input 
                              defaultValue={(user.monthly_fee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              onBlur={(e) => updateMonthlyFee(user.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && updateMonthlyFee(user.id, (e.target as HTMLInputElement).value)}
                              className="h-10 rounded-xl bg-slate-50 border-none font-black text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <button 
                            onClick={() => updateFinance(user.id, user.subscription_status === 'Ativo' ? 'Inativo' : 'Ativo')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:scale-105 ${user.subscription_status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                          >
                            {user.subscription_status || 'Inativo'}
                          </button>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={user.subscription_status === 'Ativo' ? 'default' : 'outline'} 
                              onClick={() => updateFinance(user.id, 'Ativo')} 
                              className="rounded-lg text-[10px] font-black h-9 px-4"
                            >
                              PAGO
                            </Button>
                            <Button 
                              size="sm" 
                              variant={user.subscription_status === 'Inativo' ? 'destructive' : 'outline'} 
                              onClick={() => updateFinance(user.id, 'Inativo')} 
                              className="rounded-lg text-[10px] font-black h-9 px-4"
                            >
                              PENDENTE
                            </Button>
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

      <ExerciseDialog isOpen={isExerciseDialogOpen} onClose={() => setIsExerciseDialogOpen(false)} onSave={handleAddExerciseToUser} />
      <StudentDialog isOpen={isStudentDialogOpen} onClose={() => setIsStudentDialogOpen(false)} onSave={handleCreateStudent} />
      <StudentDetailsSheet student={viewingUser} isOpen={!!viewingUser} onClose={() => setViewingUser(null)} />
    </div>
  );
};

export default Admin;