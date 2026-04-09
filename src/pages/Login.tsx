"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Linkedin, Chrome, Apple, ArrowRight, Zap } from 'lucide-react';
import SocialInput from '@/components/SocialInput';
import { showSuccess } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  });

  const handleFinish = () => {
    localStorage.setItem('kifit_user', JSON.stringify(formData));
    showSuccess(`Bem-vindo, ${formData.nome}!`);
    navigate('/');
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
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Nome Completo</Label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="Como quer ser chamado?"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Telefone / WhatsApp</Label>
                <Input 
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">E-mail de Acesso</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white shadow-sm font-bold"
                  placeholder="seu@email.com"
                />
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest mt-4">
                Próximo <ArrowRight className="ml-2" size={18} />
              </Button>
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
              
              <div className="pt-4 space-y-3">
                <p className="text-[10px] font-black text-center uppercase tracking-widest text-slate-400">Ou acesse com</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-slate-200"><Chrome size={20} /></Button>
                  <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-slate-200"><Apple size={20} /></Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">Voltar</Button>
                <Button onClick={handleFinish} className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest">Finalizar</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;