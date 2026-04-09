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
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@admin.com') {
        navigate('/');
        return;
      }
      fetchUsers();
    };
    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error) setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-slate-900 text-white pt-12 pb-20 px-6 rounded-b-[3rem] shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 rounded-2xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                Painel Gestor <ShieldCheck className="text-primary" />
              </h1>
              <p className="text-slate-400 font-medium">Controle total da plataforma Ki-Fit</p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex-1 md:flex-none text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usuários</p>
              <p className="text-2xl font-black">{users.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex-1 md:flex-none text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ativos Hoje</p>
              <p className="text-2xl font-black">{Math.floor(users.length * 0.7)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-10">
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
                    <p className="text-[10px] font-black uppercase text-slate-400">Nível Médio</p>
                    <div className="flex items-center gap-1 justify-center">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-sm font-black text-slate-700">Lvl 4</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="mt-12"><MadeWithDyad /></footer>
    </div>
  );
};

export default Admin;