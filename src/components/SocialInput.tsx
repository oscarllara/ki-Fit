"use client";

import React from 'react';
import { Input } from "@/components/ui/label";
import { Input as BaseInput } from "@/components/ui/input";

interface SocialInputProps {
  label: string;
  prefix: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const SocialInput = ({ label, prefix, value, onChange, icon }: SocialInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <span className="pl-4 text-slate-400 text-sm font-medium select-none">{prefix}</span>
        <BaseInput 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-sm font-bold text-slate-700 pl-1"
          placeholder="seu-usuario"
        />
      </div>
    </div>
  );
};

export default SocialInput;