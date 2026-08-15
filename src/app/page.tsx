import Link from "next/link";
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";
import {
  CreditCard,
  Youtube,
  Music,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Server,
  CalendarDays,
  Clapperboard,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const metadata = {
  title: "Emanuel Web Design | Peaceful church websites",
  description:
    "I build modern, serene, and accessible church websites with managed content, simple pricing, and a dedicated client portal.",
};

const approachFeatures = [
  {
    title: "A Managed Ecosystem",
    body: "Every website comes with a simple dashboard for sermons, events, and updates—no tech wrangling required.",
  },
  {
    title: "Pastor-Friendly Design",
    body: "I build with clear next steps and accessible layouts so you never have to wrestle with settings late at night.",
  },
  {
    title: "NE Colorado Native",
    body: "From Yuma to Sterling and Akron—I know the rural church rhythm and deliver support that actually answers.",
  },
  {
    title: "Personal Support",
    body: "You'll reach me directly, not a call center. I keep your site live, secure, and up to date so you don't have to.",
  },
];

const stats = [
  {
    stat: "65%",
    label: "Visit the site before visiting in person",
    note: "Search-friendly pages and clear service info build trust for first-timers.",
  },
  {
    stat: "+27%",
    label: "Higher giving when online is simple",
    note: "Prominent next steps and secure flows keep generosity moving all week.",
  },
  {
    stat: "4×",
    label: "More attendance when livestreams are easy to find",
    note: "Clear livestream and archive hubs serve homebound and travelers.",
  },
  {
    stat: "3–5 min",
    label: "Average devotional watch/read time",
    note: "Short video and written devotionals keep members connected between Sundays.",
  },
];

const capabilities = [
    { text: "Online giving", icon: <CreditCard className="w-6 h-6" /> },
    { text: "Sermon archives", icon: <Clapperboard className="w-6 h-6" /> },
    { text: "Livestream embeds", icon: <Youtube className="w-6 h-6" /> },
    { text: "Music playlists", icon: <Music className="w-6 h-6" /> },
    { text: "Prayer requests", icon: <HeartHandshake className="w-6 h-6" /> },
    { text: "Announcements", icon: <Megaphone className="w-6 h-6" /> },
    { text: "Security & backups", icon: <ShieldCheck className="w-6 h-6" /> },
    { text: "Managed hosting", icon: <Server className="w-6 h-6" /> },
    { text: "Event calendars", icon: <CalendarDays className="w-6 h-6" /> },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />

      <main className="flex-1">
        {/* Pull the hero up behind the transparent nav. The offset must match
            the nav's real height (h-16 / sm:h-20) plus the iOS safe area, or a
            sliver of background shows through above the image on phones. */}
        <section className="relative overflow-hidden -mt-[calc(4rem+env(safe-area-inset-top))] pt-[calc(4rem+env(safe-area-inset-top))] sm:-mt-[calc(5rem+env(safe-area-inset-top))] sm:pt-[calc(5rem+env(safe-area-inset-top))]">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-no-repeat blur-[2px] opacity-95"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundPosition: "center center",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--background)]/3 via-[color:var(--background)]/14 to-[color:var(--background)]/55" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[color:var(--background)]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-28">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-[2rem] leading-tight sm:text-5xl lg:text-6xl font-serif font-semibold text-[color:var(--foreground)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                Open Your Doors to the World
              </h1>
              <p className="text-base sm:text-xl text-[color:var(--muted-foreground)] leading-relaxed max-w-3xl mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                I build and manage websites for local churches, handling everything from sermon archives to online giving so you can focus on your ministry.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                >
                  View packages
                </Link>
                <Link
                  href="/dashboard/client-portal"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[color:var(--foreground)]/80 text-base font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
                >
                  Client portal
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Approach</p>
            <h2 className="text-3xl font-serif font-semibold">Your time is important.</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">
              You shouldn’t burn evenings on tech. I design, host, and manage the site so your attention stays on the message.
            </p>
          </div>
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            {approachFeatures.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-5 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-[color:var(--muted-foreground)] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[color:var(--secondary)]/60 border-y border-[color:var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
            <div className="space-y-3 text-center max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Why it matters</p>
              <h2 className="text-3xl font-serif font-semibold">Your website is the new front door.</h2>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                First impressions, giving, and weekly touchpoints start online. I design for seekers, members, and the homebound so ministry can reach beyond Sunday.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-5 shadow-sm space-y-2">
                  <p className="text-3xl font-serif font-semibold text-[color:var(--foreground)]">{item.stat}</p>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">{item.label}</p>
                  <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-8">
            <div className="space-y-2 text-center max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Capabilities</p>
              <h2 className="text-3xl font-serif font-semibold">Built-in tools for everyday ministry.</h2>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                Every site comes ready for your church’s rhythm: giving, sermons, music, livestreams, prayer, news, and community boards—all managed and secured.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {capabilities.map((item) => (
                    <div key={item.text} className="flex items-center gap-4 p-4 rounded-lg">
                        <div className="text-[color:var(--primary)]">{item.icon}</div>
                        <span className="font-semibold">{item.text}</span>
                    </div>
                ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-xl sm:text-3xl font-serif font-semibold">Ready to modernize your church’s digital front door?</h2>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                Tell me about your congregation, and I’ll handle the technical details—the site, the dashboard, and the support—so you can stay focused on your ministry.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
              >
                Contact
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[color:var(--foreground)]/80 text-base font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
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
