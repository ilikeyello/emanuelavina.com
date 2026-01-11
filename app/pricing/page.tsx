import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Modern Sanctuary Agency",
  description:
    "Simple managed church website packages with professional setup, SEO, and domain connection included.",
};

export default function PricingPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-20 pt-16 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Partnership
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Simple packages for every church.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Calm, reliable web presence—built and cared for weekly so your team can stay
            focused on ministry. Every tier includes professional setup, SEO, and domain
            connection.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          {/* Starter */}
          <details className="group rounded-3xl border border-border/70 bg-white/90 p-5 text-left shadow-sm shadow-amber-100/60">
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  The Starter
                </p>
                <p className="mt-1 font-[var(--font-playfair)] text-xl text-foreground">
                  $299 Setup
                </p>
                <p className="text-base font-semibold text-foreground/90">$50/mo</p>
              </div>
              <span className="hidden text-sm font-medium text-foreground/70 group-open:inline">
                Hide details
              </span>
              <span className="text-sm font-medium text-foreground/70 group-open:hidden">
                Click to see details
              </span>
            </summary>
            <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
              <p>
                Focused on simplicity and speed for smaller congregations that need a
                calm, trustworthy web presence.
              </p>
              <p>
                Includes professional setup, SEO optimization, and domain connection.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Mobile-friendly, high-contrast design</li>
                <li>Service times, basic pages, and contact form</li>
                <li>Secure hosting and backups</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/payment?plan=starter"
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  Purchase Starter
                </Link>
              </div>
            </div>
          </details>

          {/* Main (Best Value) */}
          <details className="group relative rounded-3xl border border-amber-600 bg-amber-100/90 p-5 text-left shadow-md shadow-amber-200 open:shadow-lg">
            <div className="pointer-events-none absolute -top-3 right-4 rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-50">
              Growth Plan
            </div>
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
                  The Main
                </p>
                <p className="mt-1 font-[var(--font-playfair)] text-xl text-foreground">
                  $299 Setup
                </p>
                <p className="text-base font-semibold text-foreground/90">$99/mo</p>
              </div>
              <span className="hidden text-sm font-medium text-foreground/70 group-open:inline">
                Hide details
              </span>
              <span className="text-sm font-medium text-foreground/70 group-open:hidden">
                Click to see details
              </span>
            </summary>
            <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
              <p>
                Our Growth Plan for churches ready to expand their reach with steady,
                week-by-week support.
              </p>
              <p>
                Includes professional setup, SEO optimization, and domain connection.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Everything in Starter</li>
                <li>Weekly content updates and sermon uploads</li>
                <li>Event calendar and giving integration</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/payment?plan=main"
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  Purchase Main
                </Link>
              </div>
            </div>
          </details>

          {/* Ultimate */}
          <details className="group rounded-3xl border border-border/70 bg-white/90 p-5 text-left shadow-sm shadow-amber-100/60">
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  The Ultimate
                </p>
                <p className="mt-1 font-[var(--font-playfair)] text-xl text-foreground">
                  $799 Setup
                </p>
                <p className="text-base font-semibold text-foreground/90">$99/mo</p>
              </div>
              <span className="hidden text-sm font-medium text-foreground/70 group-open:inline">
                Hide details
              </span>
              <span className="text-sm font-medium text-foreground/70 group-open:hidden">
                Click to see details
              </span>
            </summary>
            <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
              <p>
                Full digital ministry support for multi-faceted churches with
                additional ministries, campuses, or outreach efforts.
              </p>
              <p>
                Includes professional setup, SEO optimization, and domain connection.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Everything in Main</li>
                <li>Additional ministry landing pages</li>
                <li>Priority content updates and consults</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/payment?plan=ultimate"
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  Purchase Ultimate
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
