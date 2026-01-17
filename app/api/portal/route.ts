import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { clerkOrgId } = await req.json()

    if (!clerkOrgId) {
      return NextResponse.json(
        { error: 'Missing organization ID' },
        { status: 400 }
      )
    }

    // Get church record with Stripe customer ID
    const { data: church } = await supabase
      .from('churches')
      .select('stripe_customer_id')
      .eq('clerk_org_id', clerkOrgId)
      .single()

    if (!church?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Create Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: church.stripe_customer_id,
      return_url: `${req.headers.get('origin')}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}
