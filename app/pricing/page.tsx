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
        <div className="grid gap-6 md:grid-cols-3">
          {/* Starter */}
          <div className="flex flex-col rounded-3xl border border-border/70 bg-white/85 p-6 text-left shadow-sm shadow-amber-100/60">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              The Starter
            </p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-foreground">
              $299 Setup
            </h2>
            <p className="text-lg font-semibold text-foreground/90">$50/mo</p>
            <p className="mt-1 text-sm text-foreground/70">
              Focused on simplicity and speed for smaller congregations.
            </p>
            <p className="mt-3 text-sm text-foreground/70">
              Includes professional setup, SEO optimization, and domain connection.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/80">
              <li>• Mobile-friendly, high-contrast design</li>
              <li>• Service times, basic pages, and contact form</li>
              <li>• Secure hosting and backups</li>
            </ul>
          </div>

          {/* Main (Best Value) */}
          <div className="relative flex flex-col rounded-3xl border border-amber-600 bg-amber-100/80 p-6 text-left shadow-lg shadow-amber-200">
            <div className="absolute -top-3 right-4 rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-50">
              Best Value
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
              The Main
            </p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-foreground">
              $299 Setup
            </h2>
            <p className="text-lg font-semibold text-foreground/90">$99/mo</p>
            <p className="mt-1 text-sm text-foreground/70">
              Our most popular tier—balanced for most churches.
            </p>
            <p className="mt-3 text-sm text-foreground/70">
              Includes professional setup, SEO optimization, and domain connection.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/80">
              <li>• Everything in Starter</li>
              <li>• Weekly content updates and sermon uploads</li>
              <li>• Event calendar and giving integration</li>
            </ul>
          </div>

          {/* Ultimate */}
          <div className="flex flex-col rounded-3xl border border-border/70 bg-white/85 p-6 text-left shadow-sm shadow-amber-100/60">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              The Ultimate
            </p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-foreground">
              $799 Setup
            </h2>
            <p className="text-lg font-semibold text-foreground/90">$99/mo</p>
            <p className="mt-1 text-sm text-foreground/70">
              Full digital ministry support for multi-faceted churches.
            </p>
            <p className="mt-3 text-sm text-foreground/70">
              Includes professional setup, SEO optimization, and domain connection.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/80">
              <li>• Everything in Main</li>
              <li>• Additional ministry landing pages</li>
              <li>• Priority content updates and consults</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
