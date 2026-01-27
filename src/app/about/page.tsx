import Link from "next/link";
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export const metadata = {
  title: "About | Emanuel Web Design",
  description: "Learn about Emanuel Avina's approach to building peaceful, accessible church websites.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">About</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              Emanuel Web Design is a calm, reliable partner for your church website.
            </h1>
            <p className="text-lg text-[color:var(--muted-foreground)]">
              Accessible builds and managed tech so your message reaches everyone.
            </p>
          </div>

          {/* 1. Emanuel Avina */}
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-4 text-[color:var(--muted-foreground)] leading-relaxed">
              <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">Emanuel Avina</h2>
              <p>
                I grew up in my dad’s church in Yuma, Colorado. Sundays meant stacking chairs, setting up sound, and watching how small acts of service made ministry possible. That rooted me locally and shaped how I build: practical, calm, and dependable.
              </p>
              <p>
                Today I design for churches across NE Colorado with that same mindset. I speak the language of pastors and volunteers—clear next steps, gentle visuals, and technology that disappears behind the message.
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-6 shadow-sm space-y-3">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Local roots</h3>
              <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)] list-disc list-inside">
                <li>Raised in Yuma; serving churches across NE Colorado</li>
                <li>Understands rural rhythms and volunteer-led teams</li>
                <li>Designs that feel welcoming, not corporate</li>
              </ul>
            </div>
          </div>

          {/* 2. What we offer vs DIY/non-local */}
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-6 shadow-sm space-y-3 lg:col-span-2">
              <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">What we offer</h2>
              <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)] list-disc list-inside">
                <li>Managed builds: Next.js + Tailwind + Sanity + Supabase with accessibility baked in</li>
                <li>Client Portal for updates, billing, and uploads—no tickets lost in email</li>
                <li>Content support: sermons, events, devotionals, livestreams, and giving flows</li>
                <li>Hosting, security, backups, and monitoring handled for you</li>
              </ul>
            </div>
            <div className="space-y-4 text-[color:var(--muted-foreground)] leading-relaxed">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Why not DIY or distant agencies?</h3>
              <p>
                DIY builders cost time you don’t have and often skip accessibility. Distant teams don’t know your community or answer the phone when weather cancels Sunday.
              </p>
              <p>
                A local partner means faster support, sensible defaults, and language that fits your congregation—not a generic template.
              </p>
            </div>
          </div>

          {/* 3. Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Showcase</p>
                <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">Recent ministry builds</h2>
              </div>
              <Link href="/pricing" className="hidden sm:inline-block text-sm font-semibold text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition">View packages →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="https://cnechurch.vercel.app/"
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-5 shadow-sm block hover:border-[color:var(--primary)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition"
                target="_blank"
                rel="noreferrer"
              >
                <p className="text-sm font-semibold text-[color:var(--foreground)]">Centro de Nueva Esperanza (Yuma, CO)</p>
                <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                  My dad’s church—Modern Sanctuary redesign with bilingual next steps, sermon archive, and clear giving paths.
                </p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold">Ready to modernize your church’s digital front door?</h2>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                Tell me about your congregation, and I’ll manage the site, dashboard, and support—so you stay focused on the message.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-w-[150px] items-center justify-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
              >
                Contact
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-w-[150px] items-center justify-center px-6 py-3 rounded-full border border-[color:var(--foreground)]/80 text-base font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
              >
                View packages
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
