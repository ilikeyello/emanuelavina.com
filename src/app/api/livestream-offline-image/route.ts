import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/**
 * The picture the church app shows in the livestream box when it isn't live.
 * Stored on church_info.livestream_offline_image_url (one per church).
 */

export async function GET() {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from('church_info')
    .select('livestream_offline_image_url')
    .eq('organization_id', orgId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: data?.livestream_offline_image_url ?? null });
}

export async function PUT(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const url = typeof body.url === 'string' && body.url.trim() ? body.url.trim() : null;

  // Only accept pictures uploaded to our own storage (from /api/upload-image).
  const storagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/church-content/`;
  if (url && !url.startsWith(storagePrefix)) {
    return NextResponse.json({ error: 'Upload the picture here first.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from('church_info')
    .select('organization_id')
    .eq('organization_id', orgId)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from('church_info')
        .update({ livestream_offline_image_url: url, updated_at: new Date().toISOString() })
        .eq('organization_id', orgId)
    : await supabase
        .from('church_info')
        .insert({ organization_id: orgId, name: '', livestream_offline_image_url: url });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url });
}
