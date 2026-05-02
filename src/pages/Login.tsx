"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Linkedin, ArrowRight, Zap, Lock, Camera, User } from 'lucide-react';
import SocialInput from '@/components/SocialInput';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '+55 ',
    email: '',
    password: '',
    avatar_url: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  });

  const capitalizeName = (name: string) => {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleInitialCheck = async () => {
    if (!formData.email || !formData.password) {
      showError("E-mail e senha são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      // Tenta login direto
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (!error) {
        showSuccess("Bem-vindo de volta!");
        navigate(formData.email === 'admin@admin.com' ? '/admin' : '/');
        return;
      }

      // Se o erro for "Invalid login credentials", pode ser usuário novo ou senha errada
      // Para simplificar, se não logou e não é admin, assumimos que pode ser novo cadastro
      if (formData.email !== 'admin@admin.com') {
        setIsNewUser(true);
        setStep(2);
      } else {
        throw error;
      }
    } catch (error: any) {
      showError(error.message === "Invalid login credentials" ? "Senha incorreta ou usuário não encontrado" : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nome,
            phone: formData.telefone,
            avatar_url: formData.avatar_url
          }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        await supabase.from('profiles').upsert({
          id: signUpData.user.id,
          full_name: formData.nome,
          phone: formData.telefone,
          email: formData.email,
          avatar_url: formData.avatar_url,
          instagram: formData.instagram,
          facebook: formData.facebook,
          linkedin: formData.linkedin
        });
        
        showSuccess("Conta criada com sucesso!");
        navigate('/');
      }
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary w-16 h-16 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-primary/20 mb-4">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">Ki-Fit</h1>
          <p className="text-slate-500 font-medium">
            {isNewUser ? "Complete seu cadastro" : "Sua jornada fitness começa agora"}
          </p>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">E-mail</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Senha</Label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold pl-10"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>
              <Button 
                onClick={handleInitialCheck} 
                disabled={loading}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest mt-4"
              >
                {loading ? "Verificando..." : "Acessar App"} <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer" onClick={() => {
                  const url = prompt("Cole a URL da sua foto de perfil:");
                  if (url) setFormData({...formData, avatar_url: url});
                }}>
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Camera className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full text-white shadow-md">
                    <Plus size={12} />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Toque para adicionar foto</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Nome Completo</Label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: capitalizeName(e.target.value)})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="Como quer ser chamado?"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Telefone</Label>
                <Input 
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
              <Button onClick={() => setStep(3)} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">
                Redes Sociais <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <SocialInput 
                label="Instagram" prefix="instagram.com/" value={formData.instagram}
                onChange={(val) => setFormData({...formData, instagram: val})}
                icon={<Instagram size={14} />}
              />
              <SocialInput 
                label="Facebook" prefix="facebook.com/" value={formData.facebook}
                onChange={(val) => setFormData({...formData, facebook: val})}
                icon={<Facebook size={14} />}
              />
              <SocialInput 
                label="LinkedIn" prefix="linkedin.com/in/" value={formData.linkedin}
                onChange={(val) => setFormData({...formData, linkedin: val})}
                icon={<Linkedin size={14} />}
              />
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">Voltar</Button>
                <Button onClick={handleSignUp} disabled={loading} className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest">
                  {loading ? 'Criando...' : 'Finalizar'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;