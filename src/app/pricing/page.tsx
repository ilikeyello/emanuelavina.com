// Force dynamic rendering to ensure the pricing table always has the latest auth state.
export const dynamic = 'force-dynamic';

import { ClerkLoaded, PricingTable, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export const metadata = {
  title: "Pricing | Emanuel Web Design",
  description: "Transparent pricing from Emanuel Web Design for church websites, hosting, and client portal support.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">Clear packages for every congregation.</h1>
            <p className="text-lg text-[color:var(--muted-foreground)]">
              Reliable builds with ongoing care, accessible design, and a client portal to keep communication peaceful.
            </p>
          </div>

          {/* Message for signed-out users */}
          <SignedOut>
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-[color:var(--muted)]/50 rounded-xl p-6 text-center">
                <p className="text-lg font-semibold mb-2">Create an account to purchase packages</p>
                <p className="text-[color:var(--muted-foreground)] mb-4">
                  Sign up for a free account to view pricing details and purchase a subscription plan.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </SignedOut>

          {/* Clerk's PricingTable component */}
          <div className="max-w-6xl mx-auto">
            <ClerkLoaded>
              <PricingTable
                for="organization"
                appearance={{
                  elements: {
                    card: 'flex flex-col',
                    planFeatures: 'flex-grow',
                    actionButton: 'mt-auto',
                  },
                }}
              />
            </ClerkLoaded>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-serif font-semibold">Need a custom scope?</h2>
              <p className="text-[color:var(--muted-foreground)]">We can tailor flows for multi-campuses, multilingual content, or unique integrations.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/sign-in"
                className="text-[color:var(--primary)] hover:underline"
              >
                Sign in
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
              >
                Talk with Emanuel
              </Link>
              <Link
                href="/dashboard/client-portal"
                className="inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full border border-[color:var(--foreground)]/80 text-base font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
              >
                Client portal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
