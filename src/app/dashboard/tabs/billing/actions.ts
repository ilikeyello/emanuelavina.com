'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripePortalUrl() {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error('No active organization found.');
  }

  try {
    const org = await clerkClient.organizations.getOrganization({ organizationId: orgId });
    const stripeCustomerId = org.privateMetadata?.stripeCustomerId as string | undefined;

    if (!stripeCustomerId) {
      throw new Error('Stripe customer ID not found for this organization.');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/client-portal?tab=billing`,
    });

    redirect(portalSession.url);

  } catch (error) {
    console.error('Error creating Stripe portal session:', error);
    throw new Error('Could not create billing portal session.');
  }
}
