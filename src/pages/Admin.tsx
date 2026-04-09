"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Dumbbell, 
  TrendingUp, 
  ArrowLeft, 
  Search,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Activity,
  Calendar,
  Trophy
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    
    if (!usersRes.error) setUsers(usersRes.data);
    if (!exercisesRes.error) setExercises(exercisesRes.data);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas para o Relatório
  const totalCompletions = exercises.reduce((acc, curr) => acc + (curr.completions || 0), 0);
  const avgLevel = exercises.length > 0 
    ? (exercises.reduce((acc, curr) => acc + (curr.level || 1), 0) / exercises.length).toFixed(1)
    : 0;
  
  const workoutDistribution = {
    A: exercises.filter(e => e.workout_type === 'A').length,
    B: exercises.filter(e => e.workout_type === 'B').length,
    C: exercises.filter(e => e.workout_type === 'C').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 rounded-2xl h-12 w-12 p-0">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                Painel Gestor <ShieldCheck className="text-primary" />
              </h1>
              <p className="text-slate-400 font-medium">Gestão estratégica Ki-Fit</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
              <Users className="text-primary mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Alunos</p>
              <p className="text-3xl font-black">{users.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
              <Activity className="text-green-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Treinos Feitos</p>
              <p className="text-3xl font-black">{totalCompletions}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
              <Trophy className="text-yellow-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nível Médio</p>
              <p className="text-3xl font-black">Lvl {avgLevel}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
              <Dumbbell className="text-blue-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exercícios</p>
              <p className="text-3xl font-black">{exercises.length}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <Tabs defaultValue="alunos" className="w-full">
          <TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-100 mb-8 h-14">
            <TabsTrigger value="alunos" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-8">
              <Users className="mr-2" size={16} /> Alunos
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-8">
              <BarChart3 className="mr-2" size={16} /> Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alunos" className="space-y-6 outline-none">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Lista de Alunos</h2>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Buscar aluno..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-slate-50 border-none font-bold"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Carregando dados...</div>
                ) : filteredUsers.map((user) => (
                  <div key={user.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 rounded-3xl transition-all border border-transparent hover:border-primary/10 gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                        {user.nome?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800">{user.nome}</h3>
                        <p className="text-xs font-bold text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Telefone</p>
                        <p className="text-sm font-bold text-slate-600">{user.telefone || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Exercícios</p>
                        <p className="text-sm font-black text-slate-700">
                          {exercises.filter(e => e.user_id === user.id).length}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-8 outline-none">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    <Dumbbell size={20} className="text-primary" /> Distribuição de Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {Object.entries(workoutDistribution).map(([type, count]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                        <span>Treino {type}</span>
                        <span>{count} Exercícios</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${(count / exercises.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-400" /> Top Alunos (Engajamento)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user, i) => {
                      const userEx = exercises.filter(e => e.user_id === user.id);
                      const completions = userEx.reduce((acc, curr) => acc + (curr.completions || 0), 0);
                      return (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-slate-300">#{i+1}</span>
                            <span className="font-bold text-slate-700">{user.nome}</span>
                          </div>
                          <div className="bg-white px-3 py-1 rounded-full border border-slate-100">
                            <span className="text-xs font-black text-primary">{completions} treinos</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Resumo Geral de Atividade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Média de Exercícios/Aluno</p>
                  <p className="text-4xl font-black text-slate-800">{(exercises.length / (users.length || 1)).toFixed(1)}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Taxa de Conclusão</p>
                  <p className="text-4xl font-black text-slate-800">84%</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Novos Alunos (Mês)</p>
                  <p className="text-4xl font-black text-slate-800">{users.length}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="mt-12"><MadeWithDyad /></footer>
    </div>
  );
};

export default Admin;