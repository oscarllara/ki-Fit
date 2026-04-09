import { createClient } from '@supabase/supabase-js';

// Busca as variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as chaves não existirem, usamos valores temporários para evitar que o app quebre (tela branca)
// Mas o app só funcionará corretamente após a integração ser concluída
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Atenção: Chaves do Supabase não encontradas. Clique no botão 'Add Supabase' para configurar.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);