'use client';

import { OrganizationProfile } from '@clerk/nextjs';

// Clerk's OrganizationProfile — members, org settings, and billing all live
// here, which is why the tab is "Org" rather than "Billing".
export default function OrgTab() {
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
