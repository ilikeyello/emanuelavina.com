'use client';

import { OrganizationProfile } from '@clerk/nextjs';

export default function BillingTab() {
  return (
    <OrganizationProfile 
      routing="path"
      path="/dashboard/client-portal"
      appearance={{
        elements: {
          rootBox: 'w-full',
          card: 'shadow-none w-full border-none',
          navbar: 'hidden',
          pageScrollBox: 'p-0',
        },
      }}
    />
  );
}
