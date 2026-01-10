import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Modern Sanctuary Agency",
  description:
    "$99/mo managed partnership for churches—hosting, updates, sermons, and secure giving handled for you.",
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
            $99/mo Managed Partnership
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Calm, reliable web presence—built and cared for weekly so your team can stay
            focused on ministry.
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-white/85 p-8 shadow-xl shadow-amber-100/40 backdrop-blur">
          <ul className="space-y-4 text-lg leading-8 text-foreground/80">
            {[
              "High-speed hosting with SSL and backups",
              "Weekly updates to content, events, and CTAs",
              "Sermon uploads and archive maintenance",
              "Secure giving integration and guidance",
              "Accessibility-minded design (WCAG 2.1)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-700" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Start partnership
            </Link>
            <Link
              href="/payment"
              className="rounded-full border border-foreground/20 px-6 py-3 text-base font-semibold text-foreground transition hover:border-foreground/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60"
            >
              Payment portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
