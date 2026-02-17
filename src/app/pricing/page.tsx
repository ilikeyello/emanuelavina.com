// Force dynamic rendering to ensure the pricing table always has the latest auth state.
export const dynamic = 'force-dynamic';

import { ClerkLoaded, SignedIn, SignedOut } from '@clerk/nextjs';
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

          {/* Custom Pricing Table */}
          <div className="max-w-6xl mx-auto">
            <ClerkLoaded>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Plan */}
                <div className="flex flex-col rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-semibold">Basic</h3>
                    <p className="text-4xl font-bold">$299<span className="text-lg font-normal text-[color:var(--muted-foreground)]">/month</span></p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Beautiful church website
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Mobile-responsive design
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Sermon management system
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Event calendar
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Basic analytics
                      </li>
                    </ul>
                  </div>
                  <SignedIn>
                    <button className="mt-8 w-full inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]">
                      Subscribe Now
                    </button>
                  </SignedIn>
                  <SignedOut>
                    <Link
                      href="/custom-sign-up?redirect=/pricing&plan=basic"
                      className="mt-8 w-full inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                    >
                      Get Started
                    </Link>
                  </SignedOut>
                </div>

                {/* Pro Plan */}
                <div className="flex flex-col rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-8 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                  <div className="flex-1 space-y-4 mt-4">
                    <h3 className="text-2xl font-semibold">Pro</h3>
                    <p className="text-4xl font-bold">$599<span className="text-lg font-normal text-[color:var(--muted-foreground)]">/month</span></p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Everything in Basic
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Advanced analytics dashboard
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Online giving integration
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Live streaming support
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Member management system
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Priority support
                      </li>
                    </ul>
                  </div>
                  <SignedIn>
                    <button className="mt-8 w-full inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]">
                      Subscribe Now
                    </button>
                  </SignedIn>
                  <SignedOut>
                    <Link
                      href="/custom-sign-up?redirect=/pricing&plan=pro"
                      className="mt-8 w-full inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                    >
                      Get Started
                    </Link>
                  </SignedOut>
                </div>

                {/* Enterprise Plan */}
                <div className="flex flex-col rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-semibold">Enterprise</h3>
                    <p className="text-4xl font-bold">$999<span className="text-lg font-normal text-[color:var(--muted-foreground)]">/month</span></p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Everything in Pro
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Multi-campus support
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Custom app development
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        API access
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Dedicated account manager
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        24/7 phone support
                      </li>
                    </ul>
                  </div>
                  <SignedIn>
                    <button className="mt-8 w-full inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]">
                      Subscribe Now
                    </button>
                  </SignedIn>
                  <SignedOut>
                    <Link
                      href="/custom-sign-up?redirect=/pricing&plan=enterprise"
                      className="mt-8 w-full inline-flex min-w-[180px] items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                    >
                      Get Started
                    </Link>
                  </SignedOut>
                </div>
              </div>
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
