"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Linkedin, ArrowRight, Zap, Lock, Mail } from 'lucide-react';
import SocialInput from '@/components/SocialInput';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '+55 ',
    email: '',
    password: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  });

  const capitalizeName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length < 2) digits = '55';
    const limited = digits.slice(0, 13);
    if (limited.length <= 2) return `+${limited}`;
    if (limited.length <= 4) return `+${limited.slice(0, 2)} (${limited.slice(2)}`;
    if (limited.length <= 9) return `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4)}`;
    return `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4, 9)}-${limited.slice(9)}`;
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password) {
      showError("E-mail e senha são obrigatórios");
      return false;
    }
    if (formData.email !== 'admin@admin.com') {
      if (!formData.nome || !formData.telefone || formData.telefone === '+55 ') {
        showError("Nome e Telefone são obrigatórios");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    try {
      // Tentar Login Primeiro
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (!signInError) {
        showSuccess("Bem-vindo de volta!");
        if (formData.email === 'admin@admin.com') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return;
      }

      // Se o erro for e-mail não confirmado
      if (signInError.message.includes("Email not confirmed")) {
        showError("Por favor, confirme seu e-mail antes de entrar. Verifique sua caixa de entrada!");
        setLoading(false);
        return;
      }

      // Se não for erro de e-mail não confirmado e não for admin, tentar cadastro
      if (formData.email !== 'admin@admin.com') {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.nome,
              phone: formData.telefone,
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
            redes_sociais: {
              instagram: formData.instagram || '',
              facebook: formData.facebook || '',
              linkedin: formData.linkedin || ''
            }
          });
          
          showSuccess("Cadastro realizado! Verifique seu e-mail para ativar sua conta.");
          setStep(1); // Volta para o login para ele saber que precisa confirmar
        }
      } else {
        // Se for admin e deu erro de login (e não foi e-mail não confirmado), tentar criar o admin
        const { error: adminSignUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        
        if (adminSignUpError) throw adminSignUpError;
        showSuccess("Usuário Gestor criado! Verifique o e-mail admin@admin.com para ativar.");
      }

    } catch (error: any) {
      showError(error.message || "Erro ao realizar acesso");
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
          <p className="text-slate-500 font-medium">Sua jornada fitness começa aqui.</p>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">E-mail de Acesso *</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Senha *</Label>
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
              
              {formData.email !== 'admin@admin.com' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Nome Completo *</Label>
                    <Input 
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: capitalizeName(e.target.value)})}
                      className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                      placeholder="Como quer ser chamado?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Telefone / WhatsApp *</Label>
                    <Input 
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: formatPhone(e.target.value)})}
                      className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                      placeholder="+55 (00) 00000-0000"
                    />
                  </div>
                </>
              )}

              <Button 
                onClick={() => {
                  if (validateStep1()) {
                    formData.email === 'admin@admin.com' ? handleAuth() : setStep(2);
                  }
                }} 
                disabled={loading}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest mt-4"
              >
                {formData.email === 'admin@admin.com' ? 'Entrar como Gestor' : 'Próximo'} <ArrowRight className="ml-2" size={18} />
              </Button>
              
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Mail size={12} /> Verifique seu e-mail após o cadastro
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <SocialInput 
                label="Instagram" 
                prefix="instagram.com/" 
                value={formData.instagram}
                onChange={(val) => setFormData({...formData, instagram: val})}
                icon={<Instagram size={14} />}
              />
              <SocialInput 
                label="Facebook" 
                prefix="facebook.com/" 
                value={formData.facebook}
                onChange={(val) => setFormData({...formData, facebook: val})}
                icon={<Facebook size={14} />}
              />
              <SocialInput 
                label="LinkedIn" 
                prefix="linkedin.com/in/" 
                value={formData.linkedin}
                onChange={(val) => setFormData({...formData, linkedin: val})}
                icon={<Linkedin size={14} />}
              />
              
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">Voltar</Button>
                <Button onClick={handleAuth} disabled={loading} className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest">
                  {loading ? 'Carregando...' : 'Finalizar'}
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