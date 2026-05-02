"use client";

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Linkedin, ArrowRight, Zap, Lock, Camera, Plus, Loader2 } from 'lucide-react';
import SocialInput from '@/components/SocialInput';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    const numbers = value.replace(/\D/g, '');
    const core = numbers.startsWith('55') ? numbers.slice(2) : numbers;
    
    let formatted = '+55 ';
    if (core.length > 0) formatted += '(' + core.slice(0, 2);
    if (core.length > 2) formatted += ') ' + core.slice(2, 7);
    if (core.length > 7) formatted += '-' + core.slice(7, 11);
    return formatted;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Para este exemplo, usaremos Base64 para a foto. 
      // Em produção, o ideal é usar o Supabase Storage.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result as string }));
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showError("Erro ao carregar imagem");
      setLoading(false);
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
          showError("E-mail já cadastrado. Tente fazer login.");
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
      showError("Erro ao criar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-primary/20 mb-4">
            <Zap className="text-white fill-white" size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">Ki-Fit</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            {isNewUser ? "Complete seu cadastro" : "Sua jornada fitness começa agora"}
          </p>
        </div>

        <div className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha</Label>
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
                {loading ? <Loader2 className="animate-spin" /> : "Acessar App"} <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Camera className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-md">
                    <Plus size={14} />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">Toque para escolher foto</p>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: capitalizeName(e.target.value)})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="Como quer ser chamado?"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</Label>
                <Input 
                  ref={phoneRef}
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: formatWhatsApp(e.target.value)})}
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
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="h-14 rounded-2xl font-bold text-slate-500 order-2 md:order-1">Voltar</Button>
                <Button onClick={handleSignUp} disabled={loading} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 order-1 md:order-2">
                  {loading ? <Loader2 className="animate-spin" /> : 'Finalizar'}
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