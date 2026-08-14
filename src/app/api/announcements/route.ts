import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/**
 * Photos arrive as an ordered array. Older admin builds (and any other caller)
 * may still send a single `image_url`, so accept both. The database trigger
 * mirrors the first entry back into `image_url` for app builds that predate
 * galleries, so we only ever have to write the array.
 */
function toImageUrls(body: { image_urls?: unknown; image_url?: unknown }): string[] {
  if (Array.isArray(body.image_urls)) {
    return body.image_urls.filter(
      (url): url is string => typeof url === 'string' && url.length > 0
    );
  }
  return typeof body.image_url === 'string' && body.image_url.length > 0
    ? [body.image_url]
    : [];
}

export async function GET(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from('announcements')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    (data || []).map((announcement) => ({
      ...announcement,
      title: announcement.title ?? announcement.title_en ?? announcement.title_es ?? '',
      content: announcement.content ?? announcement.content_en ?? announcement.content_es ?? '',
    }))
  );
}

export async function POST(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from('announcements')
    .insert([{
      organization_id: orgId,
      title: body.title || '',
      title_en: body.title || '',
      title_es: body.title || '',
      content: body.content || '',
      content_en: body.content || '',
      content_es: body.content || '',
      priority: body.priority || 'normal',
      image_urls: toImageUrls(body),
      expires_at: body.expires_at || null,
      created_by: 'admin',
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await getSupabaseAdmin()
    .from('announcements')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
