import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: adminUser, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('role, clearance_level')
      .eq('id', user.id)
      .single()

    if (adminError || !adminUser || adminUser.role !== 'CONTROLLER' || adminUser.clearance_level !== 'LEVEL_3') {
      return new Response(JSON.stringify({ error: 'Forbidden: Insufficient clearance level' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { blueprintCode, examCenterCode, title, questions } = await req.json()

    const textEncoder = new TextEncoder()
    const rawData = JSON.stringify({ title, blueprintCode, questions })
    const hashBuffer = await crypto.subtle.digest('SHA-256', textEncoder.encode(rawData))
    const paperHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const { data: paper, error: paperError } = await supabaseClient
      .from('generated_papers')
      .insert({
        blueprint_code: blueprintCode,
        exam_center_code: examCenterCode,
        title,
        paper_hash: paperHash,
        questions_subset: questions,
        status: 'Securely Sealed',
        created_by: user.id
      })
      .select()
      .single()

    if (paperError) throw paperError

    return new Response(JSON.stringify({ message: 'Paper securely sealed & anchored', paperId: paper.id, hash: paperHash }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
