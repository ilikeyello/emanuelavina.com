# Infrastructure Verification Summary

## ✅ Confirmed Ready

### 1. Hosting: Vercel
- Build passes: `npm run build` succeeds
- Static assets excluded from auth via `proxy.ts`
- All pages pre-rendered correctly

### 2. Authentication & Organizations: Clerk
- Middleware configured (`proxy.ts`)
- Public routes defined
- Organization support enabled
- JWT Template needed for Supabase RLS

### 3. Database & Storage: Supabase
- Schema designed (`supabase/schema.sql`)
- Multi-tenant via `clerk_org_id`
- Row Level Security policies written
- Storage bucket `church-media` configured
- Client uses correct public env vars

### 4. Billing: Stripe (via Clerk)
- Pricing flow connected: Pricing → Dashboard with `?plan=`
- Dashboard auto-creates/updates church record with plan code
- Manual setup required in Stripe Dashboard

---

## ⚠️ Action Required (Manual Steps)

### 1. Supabase: Run Schema
- Copy `supabase/schema.sql` contents
- Run in Supabase SQL Editor
- Creates tables, RLS policies, storage bucket

### 2. Clerk: Create JWT Template
- Go to Clerk Dashboard > JWT Templates > New
- Select Supabase
- Add claim: `org_id` → `{{org.id}}`
- Save

### 3. Clerk: Add Webhook
- Go to Clerk Dashboard > Webhooks > Add Endpoint
- Endpoint URL: `https://yourdomain.com/api/webhooks/clerk`
- Subscribe to: `organization.created`, `organization.deleted`
- Save

### 4. Stripe: Create Products/Prices
- Create 3 products in Stripe Dashboard
  - The Digital Front Door: $50/mo
  - The Gospel Outreach: $99/mo
  - The Ministry Ecosystem: $199/mo
- Copy Price IDs (starts with `price_`)

### 5. Hosting Environment Variables
Add these 5 variables to Vercel/Netlify:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚨 Critical Fixes Needed

### 1. Update MediaManager to Use Authenticated Client
Replace the import in `components/media-manager.tsx`:
```typescript
// Change from:
import { supabase } from '@/lib/supabaseClient'
// To:
import { createClerkSupabaseClient } from '@/lib/supabaseServerClient'
```

And update all `supabase` usage to:
```typescript
const supabase = await createClerkSupabaseClient()
```

### 2. Fix Server Client Import
The `lib/supabaseServerClient.ts` has an issue - update it to:
```typescript
// Remove this line:
import { clerkClient } from '@clerk/nextjs/server'

// And replace getToken with:
import { auth } from '@clerk/nextjs/server'
const { getToken } = auth()
```

---

## 📋 File Structure Summary

```
├── app/
│   ├── dashboard/page.tsx    # Main portal with MediaManager
│   ├── pricing/page.tsx      # Links to /dashboard?plan=...
│   └── api/webhooks/clerk/   # NEW: Webhook handler
│       └── route.ts
├── components/
│   └── media-manager.tsx     # Upload/manage files per org
├── lib/
│   ├── supabaseClient.ts     # Anon client (no JWT)
│   └── supabaseServerClient.ts # NEW: Authenticated client
├── supabase/
│   └── schema.sql            # Full schema + RLS + storage
├── proxy.ts                  # Clerk middleware + static asset bypass
└── .env.local                # Local env vars (do NOT commit)
```

---

## 🚀 Next Steps

1. Apply the critical fixes above
2. Complete the manual steps
3. Deploy to Vercel/Netlify
4. Test:
   - Sign up/in
   - Create organization (should auto-create church record via webhook)
   - Upload a file
   - Verify file goes to correct org folder in Supabase Storage

Your infrastructure is **correctly designed** but requires these fixes for production use. The main issue is that the current client doesn't pass Clerk JWTs to Supabase, so RLS policies won't work.
