"use client";

import React, { useRef } from 'react';
import { Input as BaseInput } from "@/components/ui/input";

interface SocialInputProps {
  label: string;
  prefix: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const SocialInput = ({ label, prefix, value, onChange, icon }: SocialInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (inputRef.current && !value) {
      onChange(prefix);
      // Pequeno delay para garantir que o valor foi atualizado antes de mover o cursor
      setTimeout(() => {
        if (inputRef.current) {
          const pos = prefix.length;
          inputRef.current.setSelectionRange(pos, pos);
        }
      }, 10);
    } else if (inputRef.current && value.startsWith(prefix)) {
      const pos = prefix.length;
      inputRef.current.setSelectionRange(pos, pos);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    // Impede que o usuário apague o prefixo
    if (newVal.length < prefix.length) {
      onChange(prefix);
    } else {
      onChange(newVal);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
        {icon} {label}
      </label>
      <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <BaseInput 
          ref={inputRef}
          value={value || prefix}
          onChange={handleChange}
          onFocus={handleFocus}
          onClick={handleFocus}
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-sm font-bold text-slate-700 px-4"
          placeholder={prefix}
        />
      </div>
    </div>
  );
};

export default SocialInput;