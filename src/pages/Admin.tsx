"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Users, ShieldCheck, ArrowLeft, Plus, Edit, Trash2,
  TrendingUp, Wallet, AlertCircle, CheckCircle2, UserPlus, RefreshCw, X, Calendar, Phone, User, Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ExerciseDialog from '@/components/ExerciseDialog';
import StudentDialog from '@/components/StudentDialog';
import StudentDetailsSheet from '@/components/StudentDetailsSheet';
import { showSuccess, showError } from '@/utils/toast';
import { format, differenceInMonths } from 'date-fns';

const CurrencyInput = ({ initialValue, onSave }: { initialValue: number, onSave: (val: number) => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    if (!isFocused) {
      setLocalValue((initialValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [initialValue, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    const cleanValue = localValue.replace(/\./g, '').replace(',', '.');
    const numericValue = parseFloat(cleanValue);
    if (!isNaN(numericValue)) onSave(numericValue);
    else setLocalValue((initialValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  return (
    <Input 
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      className="h-10 rounded-xl bg-slate-50 border-none font-black text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20"
    />
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativo' | 'Inativo'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Pago' | 'Pendente'>('all');
  const [activeTab, setActiveTab] = useState('alunos');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

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
      showError("Erro ao carregar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await supabase.functions.invoke('sync-profiles');
      showSuccess("Sincronizado!");
      fetchData();
    } catch (err: any) {
      showError("Erro: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteStudent = async (userId: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir permanentemente o aluno ${name}? Esta ação não pode ser desfeita.`)) return;
    
    setDeletingId(userId);
    try {
      const { error } = await supabase.functions.invoke('delete-student', {
        body: { userId }
      });
      
      if (error) throw error;
      
      showSuccess("Aluno excluído com sucesso!");
      fetchData();
    } catch (err: any) {
      showError("Erro ao excluir: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const updateField = async (userId: string, field: string, value: any) => {
    const { error } = await supabase.from('profiles').update({ [field]: value }).eq('id', userId);
    if (error) {
      showError("Erro ao salvar: " + error.message);
      fetchData();
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
      showSuccess("Atualizado com sucesso!");
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingUser) return;
    const { error } = await supabase.from('profiles').update({
      full_name: editingUser.full_name,
      phone: editingUser.phone
    }).eq('id', editingUser.id);

    if (!error) {
      showSuccess("Perfil atualizado!");
      setIsEditProfileOpen(false);
      fetchData();
    } else {
      showError("Erro ao atualizar perfil");
    }
  };

  const updatePayment = async (user: any, status: string) => {
    const now = new Date();
    const updateData: any = { payment_status: status };
    
    if (status === 'Pago') {
      updateData.last_payment_date = now.toISOString();
      updateData.total_paid = (Number(user.total_paid) || 0) + (Number(user.monthly_fee) || 0);
    }

    const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
    if (error) {
      showError("Erro ao atualizar pagamento: " + error.message);
      fetchData();
    } else {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updateData } : u));
      showSuccess(status === 'Pago' ? "Pagamento Confirmado!" : "Pagamento Pendente!");
    }
  };

  const calculateFinancials = () => {
    let totalPrevisto = 0;
    let totalRecebido = 0;
    const now = new Date();

    users.forEach(u => {
      const fee = Number(u.monthly_fee) || 0;
      const joinDate = new Date(u.created_at || now);
      const dueDay = Number(u.due_day) || 10;
      
      let months = differenceInMonths(now, joinDate) + 1;
      if (now.getDate() > dueDay) months += 1;

      totalPrevisto += (fee * months);
      totalRecebido += (Number(u.total_paid) || 0);
    });

    return {
      totalPrevisto,
      totalRecebido,
      totalPendente: totalPrevisto - totalRecebido
    };
  };

  const { totalPrevisto, totalRecebido, totalPendente } = calculateFinancials();

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name || u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : (u.subscription_status || 'Inativo') === statusFilter;
    const matchesPayment = paymentFilter === 'all' ? true : (u.payment_status || 'Pendente') === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

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
              <Button variant="outline" onClick={handleSync} disabled={syncing} className="bg-white/10 border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-4">
                <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} /> Sincronizar
              </Button>
              <Button onClick={() => setIsStudentDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-lg shadow-primary/20">
                <UserPlus size={18} className="mr-2" /> Novo Aluno
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => { setStatusFilter('all'); setPaymentFilter('all'); setActiveTab('alunos'); }} className={`p-6 rounded-[2rem] border text-left transition-all ${statusFilter === 'all' ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}>
              <Users className="mb-2" size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Total Alunos</p>
              <p className="text-2xl font-black">{users.length}</p>
            </button>
            <button onClick={() => { setStatusFilter('Ativo'); setPaymentFilter('all'); setActiveTab('alunos'); }} className={`p-6 rounded-[2rem] border text-left transition-all ${statusFilter === 'Ativo' ? 'bg-green-500 border-green-500' : 'bg-white/5 border-white/10'}`}>
              <CheckCircle2 className="mb-2" size={20} />
              <p className="text-[10px] font-black uppercase text-slate-400">Ativos</p>
              <p className="text-2xl font-black">{users.filter(u => u.subscription_status === 'Ativo').length}</p>
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

          <TabsContent value="financeiro" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-[2.5rem] shadow-xl border bg-white border-slate-100">
                <TrendingUp className="text-blue-600 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase text-slate-400">Total Previsto (Acumulado)</p>
                <p className="text-3xl font-black text-slate-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrevisto)}</p>
              </div>
              <div className="p-8 rounded-[2.5rem] shadow-xl border bg-white border-slate-100">
                <Wallet className="text-green-600 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase text-slate-400">Recebido (Total)</p>
                <p className="text-3xl font-black text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRecebido)}</p>
              </div>
              <div className="p-8 rounded-[2.5rem] shadow-xl border bg-white border-slate-100">
                <AlertCircle className="text-red-600 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase text-slate-400">Pendente</p>
                <p className="text-3xl font-black text-red-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-8">Controle de Mensalidades</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="pb-4">Aluno</th>
                      <th className="pb-4">Valor (R$)</th>
                      <th className="pb-4">Vencimento (Dia)</th>
                      <th className="pb-4">Último Pagto</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="py-4 font-bold text-slate-700">{user.full_name || user.email}</td>
                        <td className="py-4">
                          <div className="w-28">
                            <CurrencyInput initialValue={user.monthly_fee || 0} onSave={(val) => updateField(user.id, 'monthly_fee', val)} />
                          </div>
                        </td>
                        <td className="py-4">
                          <Input 
                            type="number" 
                            value={user.due_day || 10} 
                            onChange={(e) => updateField(user.id, 'due_day', parseInt(e.target.value))}
                            className="w-16 h-10 rounded-xl bg-slate-50 border-none font-black text-center"
                          />
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-500">
                          {user.last_payment_date ? format(new Date(user.last_payment_date), 'dd/MM/yy HH:mm') : '---'}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.payment_status === 'Pago' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {user.payment_status === 'Pago' ? 'PAGO' : 'PENDENTE'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant={user.payment_status === 'Pago' ? 'default' : 'outline'} onClick={() => updatePayment(user, 'Pago')} className="rounded-lg text-[10px] font-black h-9 px-4">PAGO</Button>
                            <Button size="sm" variant={user.payment_status === 'Pendente' ? 'destructive' : 'outline'} onClick={() => updatePayment(user, 'Pendente')} className="rounded-lg text-[10px] font-black h-9 px-4">PENDENTE</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alunos" className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-black text-slate-800">Gestão de Alunos</h2>
                <Input placeholder="Buscar aluno..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-72 h-12 rounded-2xl bg-slate-50 border-none font-bold" />
              </div>
              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl gap-4">
                    <button onClick={() => setViewingUser(user)} className="flex items-center gap-4 w-full md:w-auto text-left hover:opacity-80 transition-opacity">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
                        {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : (user.full_name?.charAt(0) || '?')}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800">{user.full_name || user.email}</h3>
                        <p className="text-xs font-bold text-slate-400">Matrícula: {user.subscription_status || 'Inativo'}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Button variant="outline" size="icon" onClick={() => { setEditingUser(user); setIsEditProfileOpen(true); }} className="rounded-xl h-10 w-10 border-slate-200">
                        <Edit size={16} className="text-slate-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeleteStudent(user.id, user.full_name || user.email)} 
                        disabled={deletingId === user.id}
                        className="rounded-xl h-10 w-10 border-red-100 hover:bg-red-50"
                      >
                        {deletingId === user.id ? <Loader2 className="animate-spin text-red-500" size={16} /> : <Trash2 size={16} className="text-red-500" />}
                      </Button>
                      <button onClick={() => updateField(user.id, 'subscription_status', user.subscription_status === 'Ativo' ? 'Inativo' : 'Ativo')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${user.subscription_status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {user.subscription_status === 'Ativo' ? 'ATIVO' : 'INATIVO'}
                      </button>
                      <Button onClick={() => { setSelectedUser(user); setIsExerciseDialogOpen(true); }} className="rounded-xl font-black text-[10px] uppercase tracking-widest">
                        <Plus size={14} className="mr-2" /> Add Treino
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter text-slate-800">Editar Aluno</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
              <div className="relative">
                <Input 
                  value={editingUser?.full_name || ''} 
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})} 
                  className="h-12 rounded-2xl bg-slate-50 border-none font-bold pl-10"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</Label>
              <div className="relative">
                <Input 
                  value={editingUser?.phone || ''} 
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} 
                  className="h-12 rounded-2xl bg-slate-50 border-none font-bold pl-10"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateProfile} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExerciseDialog isOpen={isExerciseDialogOpen} onClose={() => setIsExerciseDialogOpen(false)} onSave={async (ex) => {
        const exerciseData = {
          title: ex.title,
          name: ex.title,
          video_url: ex.videoUrl,
          default_reps: ex.defaultReps,
          default_weight: ex.defaultWeight,
          user_id: selectedUser.id,
          workout_type: ex.workoutType || 'A',
          is_time_based: ex.isTimeBased
        };
        const { error } = await supabase.from('exercises').insert([exerciseData]);
        if (!error) { showSuccess("Treino adicionado!"); setIsExerciseDialogOpen(false); fetchData(); }
      }} />
      <StudentDialog 
        isOpen={isStudentDialogOpen} 
        onClose={() => setIsStudentDialogOpen(false)} 
        onSave={async (d) => { 
          const { error } = await supabase.functions.invoke('create-student', { body: d });
          if (error) {
            showError("Erro ao criar aluno: " + error.message);
          } else {
            showSuccess("Aluno criado com sucesso!");
            fetchData(); 
          }
        }} 
      />
      <StudentDetailsSheet student={viewingUser} isOpen={!!viewingUser} onClose={() => setViewingUser(null)} />
    </div>
  );
};

export default Admin;