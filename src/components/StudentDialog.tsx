"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Phone, DollarSign, Loader2 } from 'lucide-react';

interface StudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const StudentDialog = ({ isOpen, onClose, onSave }: StudentDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '+55 ',
    monthly_fee: '0'
  });

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const core = numbers.startsWith('55') ? numbers.slice(2) : numbers;
    let formatted = '+55 ';
    if (core.length > 0) formatted += '(' + core.slice(0, 2);
    if (core.length > 2) formatted += ') ' + core.slice(2, 7);
    if (core.length > 7) formatted += '-' + core.slice(7, 11);
    return formatted;
  };

  const handleSave = async () => {
    if (!formData.email || !formData.password || !formData.full_name) return;
    setLoading(true);
    try {
      await onSave(formData);
      setFormData({ full_name: '', email: '', password: '', phone: '+55 ', monthly_fee: '0' });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-slate-800 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <UserPlus className="text-primary" size={24} />
            </div>
            Novo Aluno
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-5 py-6">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
            <Input 
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
              placeholder="Nome do aluno" 
              className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</Label>
              <div className="relative">
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="aluno@email.com" 
                  className="h-12 rounded-2xl bg-slate-50 border-none font-bold pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha Provisória</Label>
              <div className="relative">
                <Input 
                  type="password"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  placeholder="••••••••" 
                  className="h-12 rounded-2xl bg-slate-50 border-none font-bold pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</Label>
              <div className="relative">
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: formatWhatsApp(e.target.value)})} 
                  className="h-12 rounded-2xl bg-slate-50 border-none font-bold pl-10"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mensalidade (R$)</Label>
              <div className="relative">
                <Input 
                  type="number"
                  value={formData.monthly_fee} 
                  onChange={(e) => setFormData({...formData, monthly_fee: e.target.value})} 
                  className="h-12 rounded-2xl bg-slate-50 border-none font-bold pl-10"
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Cadastrar Aluno'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;