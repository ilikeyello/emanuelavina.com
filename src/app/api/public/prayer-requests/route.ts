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

// Public endpoint for users to create prayer requests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { organization_id, title, description, is_anonymous, user_name, user_id } = body;

    if (!organization_id || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: organization_id, title, description' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('prayer_requests')
      .insert([{
        organization_id,
        title,
        description,
        is_anonymous: is_anonymous || false,
        user_name: is_anonymous ? 'Anonymous' : (user_name || 'Anonymous'),
        user_id: user_id || null,
        prayer_count: 0,
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
