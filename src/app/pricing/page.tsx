import Link from "next/link";
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export const metadata = {
  title: "Pricing | Emanuel Web Design",
  description: "Transparent pricing from Emanuel Web Design for church websites, hosting, and client portal support.",
};

const plans = [
  {
    name: "Foundation",
    price: "$1,500 + $75/mo",
    summary: "The Digital Front Door. Perfect for churches reaching new families and showing up on Google.",
    planId: "cplan_38ouV9am0mcdfPe83MSae0328Qs",
    features: [
      "Custom landing page that turns digital visitors into Sunday guests",
      "Dedicated About Us and Plan Your Visit pages for newcomers",
      "Local SEO setup: Google Maps + search registration for 'churches near me'",
      "Mobile responsive experience across all devices",
    ],
  },
  {
    name: "Ministry Suite",
    price: "$2,800 + $115/mo",
    summary: "The Connected Congregation. Our most popular plan for hybrid ministry all week.",
    planId: "cplan_38pHiTcIeNIHpUzWcBuA5cpRCfA",
    features: [
      "Includes everything in Foundation",
      "Sermon & media hub: sync YouTube sermons/livestreams with automated archives",
      "Integrated online giving with secure one-click flows",
      "Dynamic event calendar for services and events",
      "Automated updates simple enough for staff or volunteers",
    ],
  },
  {
    name: "Stewardship",
    price: "$4,500 + $165/mo",
    summary: "The Digital Home. Build a true online community with deep engagement.",
    planId: "cplan_38pI0J1IyDTHJyvYuEp2JPQe8Y8",
    features: [
      "Includes everything in Ministry Suite",
      "Interactive prayer wall with real-time requests",
      "Community bulletin board for announcements and opportunities",
      "Custom media playlists for worship or studies (YouTube or direct upload)",
      "Engaging tools for families: faith games and kids resources",
    ],
  },
];

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

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-6 flex flex-col gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-wide text-[color:var(--muted-foreground)]">{plan.name}</p>
                  <p className="text-2xl font-semibold text-[color:var(--foreground)]">{plan.price}</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{plan.summary}</p>
                </div>
                <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-[color:var(--primary)]">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link
                    href={`/api/checkout?planId=${plan.planId}`}
                    className="inline-flex items-center justify-center w-full rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold py-2.5 hover:opacity-90 transition"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-semibold">Need a custom scope?</h2>
              <p className="text-[color:var(--muted-foreground)]">We can tailor flows for multi-campuses, multilingual content, or unique integrations.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="px-5 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold hover:opacity-90 transition">
                Talk with Emanuel
              </Link>
              <Link href="/dashboard/client-portal" className="px-5 py-3 rounded-full border border-[color:var(--border)] text-[color:var(--foreground)] font-semibold hover:border-[color:var(--foreground)] transition">
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
