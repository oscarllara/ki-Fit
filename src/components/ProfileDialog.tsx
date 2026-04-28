"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from 'lucide-react';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { full_name: string, avatar_url: string }) => void;
  initialData: any;
}

const ProfileDialog = ({ isOpen, onClose, onSave, initialData }: ProfileDialogProps) => {
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setFullName(initialData.full_name || '');
      setAvatarUrl(initialData.avatar_url || '');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave({ full_name: fullName, avatar_url: avatarUrl });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-slate-800 text-center">
            Meu Perfil
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src={avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-primary text-white text-2xl font-black">
                {fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-lg">
              <Camera size={16} />
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
              <Input 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Seu nome" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL da Foto</Label>
              <Input 
                value={avatarUrl} 
                onChange={(e) => setAvatarUrl(e.target.value)} 
                placeholder="Link da sua foto" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;