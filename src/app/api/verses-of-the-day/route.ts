import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { BIBLE_BOOKS } from '@/lib/bible-books';

/**
 * Admin overrides for the app's Verse of the Day.
 *
 * The app ships a built-in 366-reference yearly list and falls back to it for
 * any date without a row here, so these are optional picks — usually for a
 * Sunday or a special service. One row per organization per date.
 */

/** Rejects references the app could never resolve in the bundled Bible JSON. */
function validate(body: Record<string, unknown>): string | null {
  const book = BIBLE_BOOKS.find((b) => b.id === body.book);
  if (!book) return 'Unknown book';

  const chapter = Number(body.chapter);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    return `${book.name} has ${book.chapters} chapters`;
  }

  const verse = Number(body.verse);
  if (!Number.isInteger(verse) || verse < 1) return 'Verse must be 1 or higher';

  if (body.end_verse != null && body.end_verse !== '') {
    const endVerse = Number(body.end_verse);
    if (!Number.isInteger(endVerse) || endVerse < verse) {
      return 'End verse must be the same as or after the start verse';
    }
  }

  if (!body.verse_date || !/^\d{4}-\d{2}-\d{2}$/.test(String(body.verse_date))) {
    return 'A date is required';
  }

  return null;
}

export async function GET() {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only today and forward — past picks are history the admin can't act on.
  const today = new Date();
  const cutoff = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const { data, error } = await getSupabaseAdmin()
    .from('verses_of_the_day')
    .select('*')
    .eq('organization_id', orgId)
    .gte('verse_date', cutoff)
    .order('verse_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const problem = validate(body);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  // Upsert on (organization_id, verse_date) so re-picking a date replaces the
  // existing choice instead of failing on the unique index.
  const { data, error } = await getSupabaseAdmin()
    .from('verses_of_the_day')
    .upsert(
      [
        {
          organization_id: orgId,
          verse_date: body.verse_date,
          book: body.book,
          chapter: Number(body.chapter),
          verse: Number(body.verse),
          end_verse:
            body.end_verse == null || body.end_verse === '' ? null : Number(body.end_verse),
          note_en: body.note_en || null,
          note_es: body.note_es || null,
          created_by: 'admin',
        },
      ],
      { onConflict: 'organization_id,verse_date' }
    )
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
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await getSupabaseAdmin()
    .from('verses_of_the_day')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
