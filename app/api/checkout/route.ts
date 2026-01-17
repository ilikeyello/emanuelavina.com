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

const plans = {
  basic: {
    name: 'The Digital Front Door',
    monthlyPriceId: process.env.STRIPE_PRICE_DIGITAL_FRONT_DOOR_MONTHLY || process.env.STRIPE_PRICE_BASIC!,
    yearlyPriceId: process.env.STRIPE_PRICE_DIGITAL_FRONT_DOOR_YEARLY || process.env.STRIPE_PRICE_BASIC!,
    setupPriceId: process.env.STRIPE_PRICE_SETUP_BASIC || null,
  },
  growth: {
    name: 'The Gospel Outreach',
    monthlyPriceId: process.env.STRIPE_PRICE_GOSPEL_OUTREACH_MONTHLY || process.env.STRIPE_PRICE_GROWTH!,
    yearlyPriceId: process.env.STRIPE_PRICE_GOSPEL_OUTREACH_YEARLY || process.env.STRIPE_PRICE_GROWTH!,
    setupPriceId: process.env.STRIPE_PRICE_SETUP_GROWTH || null,
  },
  premium: {
    name: 'The Ministry Ecosystem',
    monthlyPriceId: process.env.STRIPE_PRICE_MINISTRY_ECOSYSTEM_MONTHLY || process.env.STRIPE_PRICE_PREMIUM!,
    yearlyPriceId: process.env.STRIPE_PRICE_MINISTRY_ECOSYSTEM_YEARLY || process.env.STRIPE_PRICE_PREMIUM!,
    setupPriceId: process.env.STRIPE_PRICE_SETUP_PREMIUM || null,
  },
}

export async function POST(req: NextRequest) {
  try {
    const { plan, clerkOrgId, billingCycle } = await req.json()

    if (!plan || !clerkOrgId) {
      return NextResponse.json(
        { error: 'Missing plan or organization ID' },
        { status: 400 }
      )
    }

    const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly'
    const planConfig = plans[plan as keyof typeof plans]
    const mainPriceId = cycle === 'yearly' ? planConfig?.yearlyPriceId : planConfig?.monthlyPriceId
    const setupPriceId = cycle === 'monthly' ? planConfig?.setupPriceId : null

    if (!planConfig || !mainPriceId) {
      return NextResponse.json({ error: 'Invalid plan or price configuration' }, { status: 400 })
    }

    // Get or create church record
    const { data: church } = await supabase
      .from('churches')
      .select('*')
      .eq('clerk_org_id', clerkOrgId)
      .single()

    if (!church) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Ensure Stripe customer exists and is linked to org
    let customerId = church.stripe_customer_id as string | null
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          clerkOrgId,
        },
      })
      customerId = customer.id
      await supabase
        .from('churches')
        .update({
          stripe_customer_id: customerId,
        })
        .eq('id', church.id)
    }

    // Build line items (add setup fee only for non-yearly)
    const line_items = [
      {
        price: mainPriceId,
        quantity: 1,
      },
    ] as Stripe.Checkout.SessionCreateParams.LineItem[]

    if (setupPriceId) {
      line_items.push({
        price: setupPriceId,
        quantity: 1,
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: 'required',
      line_items,
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
      metadata: {
        clerkOrgId,
        plan,
        billingCycle: cycle,
      },
      subscription_data: {
        metadata: {
          clerkOrgId,
          plan,
          billingCycle: cycle,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
