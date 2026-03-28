import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const supabase = getSupabaseAdmin();

    if (type === 'trivia') {
      const { data, error } = await supabase
        .from('trivia_levels')
        .select('*, trivia_questions(count)')
        .eq('church_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = data.map(d => ({
         ...d,
         question_count: d.trivia_questions?.[0]?.count || 0,
         difficulty: 'medium' // Standardized default
      }));
      return NextResponse.json({ levels: formatted });
    }

    if (type === 'trivia-questions') {
      const levelId = searchParams.get('levelId');
      const { data, error } = await supabase
        .from('trivia_questions')
        .select('*')
        .eq('level_id', levelId)
        .eq('church_id', orgId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return NextResponse.json({ questions: data });
    }

    if (type === 'wordsearch-levels') {
      const { data, error } = await supabase
        .from('word_search_levels')
        .select('*, word_search_words(id, word_en, word_es)')
        .eq('church_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = data.map(d => ({
         ...d,
         words: d.word_search_words || []
      }));
      return NextResponse.json({ levels: formatted });
    }

    return NextResponse.json({ error: 'Invalid game type requested: ' + type }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const { type, payload } = body;

    if (type === 'trivia_levels') {
      const { data, error } = await supabase.from('trivia_levels').insert([{ ...payload, church_id: orgId }]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'trivia_questions') {
      const { data, error } = await supabase.from('trivia_questions').insert([{ ...payload, church_id: orgId }]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'word_search_levels') {
      const { data, error } = await supabase.from('word_search_levels').insert([{ ...payload, church_id: orgId }]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'word_search_words') {
      const { data, error } = await supabase.from('word_search_words').insert([{ ...payload, church_id: orgId }]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid mutation type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from(type as string)
      .delete()
      .eq('id', id)
      .eq('church_id', orgId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
