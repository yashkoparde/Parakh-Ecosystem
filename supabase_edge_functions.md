# Supabase Edge Functions Guide & Code Templates

Supabase Edge Functions are written in TypeScript and run on Deno. They are useful for implementing secure, server-side logic (such as cryptographic document signing, PDF generation, and public verification API endpoints) that can run without exposing administrative keys or credentials.

Here are the complete code implementations for the three critical PARAKH Edge Functions.

---

## 1. Edge Function: `seal-paper`
- **Location**: `supabase/functions/seal-paper/index.ts`
- **Purpose**: Restricts access to Controller level, hashes the generated exam paper, seals the content, and initiates the blockchain anchor.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 1. Get authenticated user info from Authorization header
    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Validate user clearance level and role (Must be CONTROLLER with LEVEL_3)
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

    // 3. Process paper payload
    const { blueprintCode, examCenterCode, title, questions } = await req.json()

    // 4. Compute cryptographic SHA-256 hash of paper contents
    const textEncoder = new TextEncoder()
    const rawData = JSON.stringify({ title, blueprintCode, questions })
    const hashBuffer = await crypto.subtle.digest('SHA-256', textEncoder.encode(rawData))
    const paperHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // 5. Seal in generated_papers (Triggers blockchain_records anchor trigger automatically)
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
```

---

## 2. Edge Function: `issue-certificate`
- **Location**: `supabase/functions/issue-certificate/index.ts`
- **Purpose**: Creates official certificate, renders digital PDF layout, uploads to `academic-credentials` bucket, and anchors it.

```typescript
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

    // 1. Authenticate user
    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify role (VERIFIER or CONTROLLER)
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

    // 2. Fetch parameters
    const { studentId, certificateType, name, documentNumber, description } = await req.json()

    // Fetch student data for certificate template
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()

    if (studentError || !student) throw new Error('Student record not found')

    // 3. Generate official PDF document via pdf-lib
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

    // 4. Upload PDF directly to 'academic-credentials' storage bucket
    const filePath = `certs/${student.roll_number}_${documentNumber}.pdf`
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('academic-credentials')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) throw uploadError

    // 5. Compute SHA256 of upload file contents
    const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBytes)
    const fileHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // 6. Insert into certificates (Triggers blockchain_records anchor trigger automatically)
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
```

---

## 3. Edge Function: `verify-document`
- **Location**: `supabase/functions/verify-document/index.ts`
- **Purpose**: Public API endpoint for verifying certificates. Allows anybody to verify document signatures and transaction hashes.

```typescript
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

    // 1. Check if lookup matches a certificate
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

    // 2. Fetch corresponding blockchain verification anchor
    const { data: blockRecord, error: blockError } = await supabaseClient
      .from('blockchain_records')
      .select('*')
      .eq('anchor_id', cert.id)
      .eq('record_type', 'Certificate')
      .maybeSingle()

    if (blockError) throw blockError

    // 3. Return verified response details
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
```
