"use client";

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Upload, QrCode, Loader2, Wallet } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  monthlyFee: number;
}

const PaymentDialog = ({ isOpen, onClose, userId, monthlyFee }: PaymentDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const pixKey = "academia@kifit.com.br"; // Chave PIX de exemplo

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    showSuccess("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      showError("Por favor, anexe o comprovante");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          payment_proof_url: file,
          payment_status: 'Pendente' // Mantém pendente até o admin validar
        })
        .eq('id', userId);

      if (error) throw error;

      showSuccess("Comprovante enviado com sucesso! Aguarde a validação.");
      onClose();
    } catch (err: any) {
      showError("Erro ao enviar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none shadow-2xl bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Wallet className="text-slate-950" size={20} />
            </div>
            Pagar Mensalidade
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center space-y-4">
            <div className="mx-auto w-32 h-32 bg-white p-2 rounded-2xl">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valor a pagar</p>
              <p className="text-3xl font-black text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyFee)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chave PIX (E-mail)</Label>
            <div className="relative flex items-center">
              <Input 
                readOnly 
                value={pixKey} 
                className="h-12 rounded-2xl bg-white/5 border-white/10 font-bold pr-12 text-white"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleCopy}
                className="absolute right-1 h-10 w-10 rounded-xl hover:bg-white/10 text-primary"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Comprovante</Label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,application/pdf" 
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-14 rounded-2xl border-dashed border-white/20 bg-white/5 font-bold flex items-center gap-3 ${file ? 'border-primary text-primary' : 'text-slate-400'}`}
            >
              {file ? <Check size={20} /> : <Upload size={20} />}
              {file ? 'Comprovante Anexado' : 'Anexar Comprovante'}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !file}
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary text-slate-950 hover:bg-primary/90"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirmar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;