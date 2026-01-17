import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'organization.created') {
      // Create church record when org is created
      await supabaseAdmin
        .from('churches')
        .insert({
          clerk_org_id: data.id,
          name: data.name,
        })
    } else if (type === 'organization.deleted') {
      // Clean up when org is deleted
      const { data: church } = await supabaseAdmin
        .from('churches')
        .select('id')
        .eq('clerk_org_id', data.id)
        .single()

      if (church) {
        // Delete media files from storage
        const { data: media } = await supabaseAdmin
          .from('church_media')
          .select('file_path')
          .eq('church_id', church.id)

        if (media) {
          const filePaths = media.map(m => m.file_path)
          await supabaseAdmin.storage
            .from('church-media')
            .remove(filePaths)
        }

        // Delete church record (cascades to media)
        await supabaseAdmin
          .from('churches')
          .delete()
          .eq('id', church.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
