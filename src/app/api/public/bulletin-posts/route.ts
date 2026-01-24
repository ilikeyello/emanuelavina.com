import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Public endpoint for users to create bulletin posts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { organization_id, title, content, author_name, author_id } = body;

    if (!organization_id || !title || !content || !author_name) {
      return NextResponse.json(
        { error: 'Missing required fields: organization_id, title, content, author_name' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('bulletin_posts')
      .insert([{
        organization_id,
        title,
        content,
        author_name,
        author_id: author_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
