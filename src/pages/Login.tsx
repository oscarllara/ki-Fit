"use client";

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Linkedin, ArrowRight, Zap, Lock, Camera, Plus } from 'lucide-react';
import SocialInput from '@/components/SocialInput';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '+55 ',
    email: '',
    password: '',
    avatar_url: '',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/in/'
  });

  const capitalizeName = (name: string) => {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Remove o 55 inicial se existir para não duplicar na lógica
    const core = numbers.startsWith('55') ? numbers.slice(2) : numbers;
    
    let formatted = '+55 ';
    if (core.length > 0) {
      formatted += '(' + core.slice(0, 2);
    }
    if (core.length > 2) {
      formatted += ') ' + core.slice(2, 7);
    }
    if (core.length > 7) {
      formatted += '-' + core.slice(7, 11);
    }
    return formatted;
  };

  const handlePhoneFocus = () => {
    if (phoneRef.current) {
      const pos = formData.telefone.length;
      phoneRef.current.setSelectionRange(pos, pos);
    }
  };

  const handleInitialCheck = async () => {
    if (!formData.email || !formData.password) {
      showError("E-mail e senha são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (!error) {
        showSuccess("Bem-vindo de volta!");
        navigate(formData.email === 'admin@admin.com' ? '/admin' : '/');
        return;
      }

      // Se o erro for credenciais inválidas, pode ser novo usuário
      if (error.message === "Invalid login credentials") {
        setIsNewUser(true);
        setStep(2);
      } else {
        throw error;
      }
    } catch (error: any) {
      showError(error.message);
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

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          showError("Este e-mail já está cadastrado. Tente fazer login com a senha correta.");
          setStep(1);
          setIsNewUser(false);
          return;
        }
        throw signUpError;
      }

      if (signUpData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: signUpData.user.id,
          full_name: formData.nome,
          phone: formData.telefone,
          email: formData.email,
          avatar_url: formData.avatar_url,
          instagram: formData.instagram,
          facebook: formData.facebook,
          linkedin: formData.linkedin,
          subscription_status: 'Ativo'
        });
        
        if (profileError) throw profileError;
        
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
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Senha</Label>
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
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest mt-4 shadow-lg shadow-primary/20"
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
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Camera className="text-slate-400" size={28} />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-md">
                    <Plus size={14} />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">Toque para adicionar foto</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: capitalizeName(e.target.value)})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="Como quer ser chamado?"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</Label>
                <Input 
                  ref={phoneRef}
                  value={formData.telefone}
                  onFocus={handlePhoneFocus}
                  onClick={handlePhoneFocus}
                  onChange={(e) => {
                    const formatted = formatWhatsApp(e.target.value);
                    setFormData({...formData, telefone: formatted});
                  }}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
              <Button onClick={() => setStep(3)} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Redes Sociais <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <SocialInput 
                label="Instagram" prefix="https://instagram.com/" value={formData.instagram}
                onChange={(val) => setFormData({...formData, instagram: val})}
                icon={<Instagram size={14} />}
              />
              <SocialInput 
                label="Facebook" prefix="https://facebook.com/" value={formData.facebook}
                onChange={(val) => setFormData({...formData, facebook: val})}
                icon={<Facebook size={14} />}
              />
              <SocialInput 
                label="LinkedIn" prefix="https://linkedin.com/in/" value={formData.linkedin}
                onChange={(val) => setFormData({...formData, linkedin: val})}
                icon={<Linkedin size={14} />}
              />
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">Voltar</Button>
                <Button onClick={handleSignUp} disabled={loading} className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
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