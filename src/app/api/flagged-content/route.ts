import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const TABLE_BY_TYPE: Record<string, string> = {
  bulletin_post: 'bulletin_posts',
  bulletin_comment: 'bulletin_comments',
  prayer_request: 'prayer_requests',
  prayer_comment: 'prayer_comments',
};

export async function GET(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getSupabaseAdmin();

  const { data: reports, error } = await admin
    .from('content_reports')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const idsByType = new Map<string, Set<number>>();
  for (const report of reports || []) {
    if (!idsByType.has(report.content_type)) idsByType.set(report.content_type, new Set());
    idsByType.get(report.content_type)!.add(report.content_id);
  }

  const contentByKey = new Map<string, unknown>();
  for (const [contentType, ids] of idsByType.entries()) {
    const table = TABLE_BY_TYPE[contentType];
    if (!table) continue;
    const { data } = await admin.from(table).select('*').in('id', Array.from(ids));
    for (const row of data || []) {
      contentByKey.set(`${contentType}-${row.id}`, row);
    }
  }

  const result = (reports || []).map((report) => ({
    ...report,
    content: contentByKey.get(`${report.content_type}-${report.content_id}`) ?? null,
  }));

  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get('contentType');
  const contentId = searchParams.get('contentId');
  const mode = searchParams.get('mode') === 'dismiss' ? 'dismiss' : 'delete';

  if (!contentType || !contentId) {
    return NextResponse.json({ error: 'contentType and contentId are required' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  if (mode === 'delete') {
    const table = TABLE_BY_TYPE[contentType];
    if (!table) return NextResponse.json({ error: 'Unknown contentType' }, { status: 400 });

    const { error } = await admin
      .from(table)
      .delete()
      .eq('id', contentId)
      .eq('organization_id', orgId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: reportError } = await admin
    .from('content_reports')
    .delete()
    .eq('organization_id', orgId)
    .eq('content_type', contentType)
    .eq('content_id', contentId);

  if (reportError) return NextResponse.json({ error: reportError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
