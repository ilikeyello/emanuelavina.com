import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Portal | Modern Sanctuary Agency",
  description:
    "Securely handle your Modern Sanctuary partnership payments with confidence and clarity.",
};

export default function PaymentPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-20 pt-16 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Payment Portal
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Manage your partnership securely.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Use the portal to update billing, download receipts, or submit a payment.
            We keep everything protected with best-practice security and SSL.
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-white/85 p-8 shadow-lg shadow-amber-100/40 backdrop-blur">
          <div className="space-y-4 text-lg leading-8 text-foreground/80">
            <p className="font-semibold text-foreground">Secure access</p>
            <p>
              Click below to open the payment portal. Your session is encrypted and
              protected. If you need help, email{" "}
              <a
                className="font-semibold text-foreground underline underline-offset-4"
                href="mailto:billing@modern-sanctuary.agency"
              >
                billing@modern-sanctuary.agency
              </a>
              .
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="https://example.com/payment" // replace with live payment URL
              className="rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Open payment portal
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-foreground/20 px-6 py-3 text-base font-semibold text-foreground transition hover:border-foreground/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60"
            >
              Get support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
