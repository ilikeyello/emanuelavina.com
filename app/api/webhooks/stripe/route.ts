import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map active price IDs to plans (aligns with checkout route)
const priceToPlan: Record<string, 'basic' | 'growth' | 'premium'> = {
  [process.env.STRIPE_PRICE_DIGITAL_FRONT_DOOR_MONTHLY || '']: 'basic',
  [process.env.STRIPE_PRICE_DIGITAL_FRONT_DOOR_YEARLY || '']: 'basic',
  [process.env.STRIPE_PRICE_GOSPEL_OUTREACH_MONTHLY || '']: 'growth',
  [process.env.STRIPE_PRICE_GOSPEL_OUTREACH_YEARLY || '']: 'growth',
  [process.env.STRIPE_PRICE_MINISTRY_ECOSYSTEM_MONTHLY || '']: 'premium',
  [process.env.STRIPE_PRICE_MINISTRY_ECOSYSTEM_YEARLY || '']: 'premium',
  // Legacy fallbacks
  [process.env.STRIPE_PRICE_BASIC || '']: 'basic',
  [process.env.STRIPE_PRICE_GROWTH || '']: 'growth',
  [process.env.STRIPE_PRICE_PREMIUM || '']: 'premium',
}

const relevantEvents = [
  'checkout.session.completed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.deleted',
  'customer.subscription.updated',
  'customer.subscription.created',
]

function derivePlanFromSubscription(subscription: Stripe.Subscription) {
  const priceId =
    subscription.items.data[0]?.price?.id ||
    (subscription as any).items?.data?.[0]?.price?.id
  if (priceId && priceToPlan[priceId]) return priceToPlan[priceId]
  if (subscription.metadata?.plan && (['basic', 'growth', 'premium'] as const).includes(subscription.metadata.plan as any)) {
    return subscription.metadata.plan as 'basic' | 'growth' | 'premium'
  }
  return null
}

async function updateChurchByOrgId(clerkOrgId: string, updates: Record<string, any>) {
  return supabase.from('churches').update(updates).eq('clerk_org_id', clerkOrgId)
}

async function updateChurchByCustomer(customerId: string, updates: Record<string, any>) {
  return supabase.from('churches').update(updates).eq('stripe_customer_id', customerId)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    if (!sig) {
      throw new Error('Missing stripe-signature header')
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!relevantEvents.includes(event.type)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { clerkOrgId, plan } = session.metadata || {}
        const subscriptionId = session.subscription as string | null
        if (clerkOrgId && session.customer) {
          const planCode =
            (plan as 'basic' | 'growth' | 'premium') ||
            (session.metadata?.plan as 'basic' | 'growth' | 'premium') ||
            (session.subscription
              ? derivePlanFromSubscription(
                  (event as any).data.object.subscription as unknown as Stripe.Subscription
                )
              : null)
          await updateChurchByOrgId(clerkOrgId, {
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            subscription_plan: planCode || null,
            subscription_status: 'active',
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string | undefined
        const customerId = invoice.customer as string | undefined

        if (subscriptionId) {
          const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as Stripe.Subscription
          const clerkOrgId = subscription.metadata?.clerkOrgId as string | undefined
          const planCode = derivePlanFromSubscription(subscription)
          const periodEnd = (subscription as any).current_period_end as number | undefined
          const updates = {
            subscription_status: 'active',
            subscription_plan: planCode || null,
            subscription_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
          }
          if (clerkOrgId) await updateChurchByOrgId(clerkOrgId, updates)
          else if (customerId) await updateChurchByCustomer(customerId, updates)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string | undefined
        const customerId = invoice.customer as string | undefined
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const clerkOrgId = subscription.metadata?.clerkOrgId as string | undefined
          const updates = { subscription_status: 'past_due' }
          if (clerkOrgId) await updateChurchByOrgId(clerkOrgId, updates)
          else if (customerId) await updateChurchByCustomer(customerId, updates)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const clerkOrgId = subscription.metadata?.clerkOrgId
        const customerId = subscription.customer as string | undefined
        const updates = {
          subscription_status: 'canceled',
          subscription_plan: null,
          stripe_subscription_id: null,
        }
        
        if (clerkOrgId) await updateChurchByOrgId(clerkOrgId, updates)
        else if (customerId) await updateChurchByCustomer(customerId, updates)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const clerkOrgId = subscription.metadata?.clerkOrgId as string | undefined
        const planCode = derivePlanFromSubscription(subscription)
        const status = subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : subscription.status
        const periodEnd = (subscription as any).current_period_end as number | undefined
        const updates = {
          subscription_plan: planCode || null,
          subscription_status: status,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          subscription_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
        }
        const customerId = subscription.customer as string | undefined
        if (clerkOrgId) await updateChurchByOrgId(clerkOrgId, updates)
        else if (customerId) await updateChurchByCustomer(customerId, updates)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler failed:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
