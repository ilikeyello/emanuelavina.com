import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');
    
    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: levels, error: levelsError } = await supabase
      .from('trivia_levels')
      .select('*')
      .eq('church_id', orgId)
      .order('created_at', { ascending: false });

    if (levelsError) throw levelsError;

    const { data: questions, error: questionsError } = await supabase
      .from('trivia_questions')
      .select('*')
      .eq('church_id', orgId)
      .order('created_at', { ascending: true });

    if (questionsError) throw questionsError;

    return NextResponse.json({
      levels: levels || [],
      questions: questions || []
    });

  } catch (error) {
    console.error('Error fetching trivia data:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
