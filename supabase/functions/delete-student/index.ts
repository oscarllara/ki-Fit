import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[delete-student] Iniciando processo de exclusão...");
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()

    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    console.log(`[delete-student] Tentando deletar usuário ${userId} do Auth...`);
    
    // 1. Tentar deletar do Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.warn(`[delete-student] Aviso ao deletar do Auth: ${authError.message}. Prosseguindo com a limpeza do banco.`);
      // Não lançamos erro aqui para permitir que perfis "órfãos" sejam limpos
    }

    // 2. Deletar exercícios
    console.log(`[delete-student] Limpando exercícios do usuário ${userId}...`);
    const { error: exError } = await supabaseAdmin.from('exercises').delete().eq('user_id', userId)
    if (exError) console.error(`[delete-student] Erro ao deletar exercícios: ${exError.message}`);
    
    // 3. Deletar perfil
    console.log(`[delete-student] Removendo perfil do usuário ${userId}...`);
    const { error: profError } = await supabaseAdmin.from('profiles').delete().eq('id', userId)
    if (profError) throw profError;

    console.log(`[delete-student] Usuário ${userId} removido com sucesso.`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(`[delete-student] Erro crítico: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})