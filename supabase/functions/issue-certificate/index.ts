import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1"

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

    const { data: admin, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || !admin || !['VERIFIER', 'CONTROLLER'].includes(admin.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { studentId, certificateType, name, documentNumber, description } = await req.json()

    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()

    if (studentError || !student) throw new Error('Student record not found')

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 400])
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

    page.drawText('PARAKH ACADEMIC RECORD CERTIFICATE', { x: 50, y: 340, size: 20, font, color: rgb(0.1, 0.2, 0.4) })
    page.drawText(`Document Number: ${documentNumber}`, { x: 50, y: 310, size: 10, font })
    page.drawText(`This certifies that candidate:`, { x: 50, y: 260, size: 12, font: fontItalic })
    page.drawText(student.name.toUpperCase(), { x: 50, y: 230, size: 18, font, color: rgb(0, 0, 0) })
    page.drawText(`Roll Number: ${student.roll_number}   |   Candidate ID: ${student.candidate_id}`, { x: 50, y: 200, size: 10, font })
    page.drawText(`Has completed requirements for:`, { x: 50, y: 170, size: 11, font: fontItalic })
    page.drawText(student.program, { x: 50, y: 140, size: 12, font })
    page.drawText(`Issued Date: ${new Date().toLocaleDateString()}   |   Authority Signature Signed`, { x: 50, y: 80, size: 9, font })

    const pdfBytes = await pdfDoc.save()

    const filePath = `certs/${student.roll_number}_${documentNumber}.pdf`
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('academic-credentials')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) throw uploadError

    const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBytes)
    const fileHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const { data: cert, error: certError } = await supabaseClient
      .from('certificates')
      .insert({
        student_id: studentId,
        name,
        document_number: documentNumber,
        type: certificateType,
        description,
        blockchain_hash: fileHash,
        file_path: filePath,
        status: 'Issued'
      })
      .select()
      .single()

    if (certError) throw certError

    return new Response(JSON.stringify({ message: 'Certificate issued, uploaded and anchored', certificate: cert }), {
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
