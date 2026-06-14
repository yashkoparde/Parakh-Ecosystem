import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, content-type',
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

    const { referenceNumber, documentHash } = await req.json()

    let query = supabaseClient.from('certificates').select('*, students(name, roll_number, program)')
    
    if (referenceNumber) {
      query = query.eq('document_number', referenceNumber)
    } else if (documentHash) {
      query = query.eq('blockchain_hash', documentHash)
    } else {
      return new Response(JSON.stringify({ error: 'Bad Request: Please supply referenceNumber or documentHash' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: cert, error: certError } = await query.maybeSingle()

    if (certError) throw certError

    if (!cert) {
      return new Response(JSON.stringify({ verified: false, status: 'Record Not Found', message: 'No registered records match the criteria' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: blockRecord, error: blockError } = await supabaseClient
      .from('blockchain_records')
      .select('*')
      .eq('anchor_id', cert.id)
      .eq('record_type', 'Certificate')
      .maybeSingle()

    if (blockError) throw blockError

    return new Response(
      JSON.stringify({
        verified: cert.status === 'Issued' && blockRecord?.status === 'Anchored',
        status: cert.verification_status,
        documentName: cert.name,
        documentType: cert.type,
        rollNumber: cert.students.roll_number,
        candidateName: cert.students.name,
        program: cert.students.program,
        computedHash: cert.blockchain_hash,
        txHash: cert.tx_hash,
        blockNumber: blockRecord?.block_number,
        digitalSignature: blockRecord?.digital_signature,
        issuingAuthority: cert.issuing_authority,
        dateOfIssue: cert.issued_date,
        registryHashMatched: blockRecord ? true : false
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
