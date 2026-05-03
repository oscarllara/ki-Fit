"use client";

import React from 'react';
import { User, LogOut, Shield, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserNavProps {
  user: any;
  onLogout: () => void;
  onAdmin: () => void;
  onProfileUpdate: () => void;
  isAdmin: boolean;
}

const UserNav = ({ user, onLogout, onAdmin, onProfileUpdate, isAdmin }: UserNavProps) => {
  const fullName = user?.full_name || user?.nome || 'Usuário';
  const firstName = fullName.split(' ')[0];
  const initials = firstName.slice(0, 2).toUpperCase();

  return (
    <div className="fixed top-6 right-6 z-[9999]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-14 w-auto pl-2 pr-4 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-slate-800 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                <AvatarImage src={user?.avatar_url} alt={firstName} className="object-cover" />
                <AvatarFallback className="bg-primary text-slate-950 font-black text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left hidden sm:flex">
                <span className="text-xs font-black text-white leading-none uppercase tracking-tighter">
                  {firstName}
                </span>
                <span className="text-[10px] font-bold text-slate-400 leading-none mt-1">
                  {isAdmin ? 'Gestor Ki Body Fit' : 'Atleta'}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 rounded-[1.5rem] p-2 shadow-2xl border border-white/10 bg-slate-900 z-[10000]" 
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-400 px-4 py-3">
            Minha Conta
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/5" />
          {isAdmin && (
            <DropdownMenuItem 
              onClick={onAdmin} 
              className="rounded-xl h-12 font-bold text-white focus:bg-primary focus:text-slate-950 cursor-pointer"
            >
              <Shield className="mr-2 h-4 w-4" />
              Painel Gestor
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={onProfileUpdate} 
            className="rounded-xl h-12 font-bold text-white focus:bg-primary focus:text-slate-950 cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuItem 
            onClick={onLogout} 
            className="rounded-xl h-12 font-bold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair do App
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserNav;