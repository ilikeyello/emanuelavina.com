# Stripe Billing Setup Guide

## 1. Install Stripe Package
```bash
npm install stripe
```

## 2. Create Stripe Products & Prices
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** > **Add product**
3. Create 3 products:

### The Digital Front Door
- Name: `The Digital Front Door`
- Description: `Basic church website package`
- Price: `$50.00` USD/month
- Copy the Price ID (starts with `price_`)

### The Gospel Outreach
- Name: `The Gospel Outreach`
- Description: `Growth church website package`
- Price: `$99.00` USD/month
- Copy the Price ID

### The Ministry Ecosystem
- Name: `The Ministry Ecosystem`
- Description: `Premium church website package`
- Price: `$199.00` USD/month
- Copy the Price ID

## 3. Update Price IDs
Edit `app/api/checkout/route.ts` and replace the placeholder price IDs:
```typescript
const plans = {
  basic: {
    name: 'The Digital Front Door',
    price: 5000,
    stripePriceId: 'price_ACTUAL_BASIC_ID', // Replace
  },
  growth: {
    name: 'The Gospel Outreach',
    price: 9900,
    stripePriceId: 'price_ACTUAL_GROWTH_ID', // Replace
  },
  premium: {
    name: 'The Ministry Ecosystem',
    price: 19900,
    stripePriceId: 'price_ACTUAL_PREMIUM_ID', // Replace
  },
}
```

## 4. Configure Webhook
1. In Stripe Dashboard > **Developers** > **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret

## 5. Environment Variables
Add to your `.env.local` and hosting:
```env
STRIPE_SECRET_KEY=sk_test_... (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_... (from webhook setup)
```

## 6. Update Schema (Optional)
Add these columns to your `churches` table for better tracking:
```sql
ALTER TABLE public.churches
ADD COLUMN subscription_status text,
ADD COLUMN subscription_period_end timestamptz;
```

## Flow Summary
1. User clicks "Purchase" on pricing page
2. Creates Stripe checkout session with org metadata
3. User completes payment in Stripe Checkout
4. Stripe webhook updates church record
5. User can manage billing via dashboard portal

Your Stripe billing is now integrated!
