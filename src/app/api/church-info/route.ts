import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryOrgId = searchParams.get('orgId');

    if (queryOrgId !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('church_info')
      .select('*')
      .eq('organization_id', orgId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json(data || null);
  } catch (error) {
    console.error('Error fetching church info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.organization_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('church_info')
      .update({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        service_times: body.service_times,
        description: body.description,
        facebook_page_url: body.facebook_page_url,
        website_url: body.website_url,
        latitude: body.latitude,
        longitude: body.longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('organization_id', orgId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating church info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
