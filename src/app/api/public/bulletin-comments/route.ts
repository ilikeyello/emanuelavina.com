import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// Public endpoint for users to create comments on bulletin posts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { organization_id, bulletin_post_id, content, author_name, author_id } = body;

    if (!organization_id || !bulletin_post_id || !content || !author_name) {
      return NextResponse.json(
        { error: 'Missing required fields: organization_id, bulletin_post_id, content, author_name' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('bulletin_comments')
      .insert([{
        organization_id,
        bulletin_post_id,
        content,
        author_name,
        author_id: author_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Get comments for a specific bulletin post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bulletin_post_id = searchParams.get('bulletin_post_id');

    if (!bulletin_post_id) {
      return NextResponse.json(
        { error: 'Missing bulletin_post_id parameter' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('bulletin_comments')
      .select('*')
      .eq('bulletin_post_id', bulletin_post_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
