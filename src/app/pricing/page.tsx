import { PricingTable } from '@clerk/nextjs'
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";
import { FallbackPricing } from "@/components/site/FallbackPricing";

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

          {/* Clerk's PricingTable component */}
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Debug Info:</strong> If you don't see pricing packages below, please check:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                <li>Billing is enabled in Clerk Dashboard</li>
                <li>Plans are active and not hidden</li>
                <li>You're logged into Clerk</li>
                <li>Environment variables are correct</li>
              </ul>
            </div>
            <PricingTable for="organization" />
            
            {/* Fallback pricing if Clerk doesn't load */}
            <div className="mt-12">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground">Or view our standard packages</p>
              </div>
              <FallbackPricing />
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-semibold">Need a custom scope?</h2>
              <p className="text-[color:var(--muted-foreground)]">We can tailor flows for multi-campuses, multilingual content, or unique integrations.</p>
            </div>
            <div className="flex gap-3">
              <a href="/contact" className="px-5 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold hover:opacity-90 transition">
                Talk with Emanuel
              </a>
              <a href="/dashboard/client-portal" className="px-5 py-3 rounded-full border border-[color:var(--border)] text-[color:var(--foreground)] font-semibold hover:border-[color:var(--foreground)] transition">
                Client portal
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
