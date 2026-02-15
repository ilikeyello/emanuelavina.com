import Link from "next/link";
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export const metadata = {
  title: "About | Emanuel Web Design",
  description: "Learn about Emanuel Avina's approach to building peaceful, accessible church websites.",
};

const aboutSections = [
  {
    main: {
      title: "Emanuel Avina",
      content: [
        "I grew up in my dad’s church in Yuma, Colorado. Sundays meant stacking chairs, setting up sound, and watching how small acts of service made ministry possible. That rooted me locally and shaped how I build: practical, calm, and dependable.",
        "Today I design for churches across NE Colorado with that same mindset. I speak the language of pastors and volunteers—clear next steps, gentle visuals, and technology that disappears behind the message.",
      ],
    },
    aside: {
      title: "Local roots",
      points: [
        "Raised in Yuma; serving churches across NE Colorado",
        "Understands rural rhythms and volunteer-led teams",
        "Designs that feel welcoming, not corporate",
      ],
    },
    reverse: false,
  },
  {
    main: {
      title: "What we offer",
      points: [
        "Managed builds: Next.js + Tailwind + Sanity + Supabase with accessibility baked in",
        "Client Portal for updates, billing, and uploads—no tickets lost in email",
        "Content support: sermons, events, devotionals, livestreams, and giving flows",
        "Hosting, security, backups, and monitoring handled for you",
      ],
    },
    aside: {
      title: "Why not DIY or distant agencies?",
      content: [
        "DIY builders cost time you don’t have and often skip accessibility. Distant teams don’t know your community or answer the phone when weather cancels Sunday.",
        "A local partner means faster support, sensible defaults, and language that fits your congregation—not a generic template.",
      ],
    },
    reverse: true,
  },
];

const showcaseProjects = [
  {
    name: "Centro de Nueva Esperanza (Yuma, CO)",
    description: "My dad’s church—Modern Sanctuary redesign with bilingual next steps, sermon archive, and clear giving paths.",
    url: "https://cnechurch.vercel.app/",
  },
];

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

          {aboutSections.map((section, index) => (
            <div key={index} className="grid gap-6 lg:grid-cols-3 items-start">
              <div className={`lg:col-span-2 space-y-4 text-[color:var(--muted-foreground)] leading-relaxed ${section.reverse ? 'lg:order-last' : ''}`}>
                <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">{section.main.title}</h2>
                {section.main.content?.map((p, i) => <p key={i}>{p}</p>)}
                {section.main.points && (
                  <ul className="space-y-2 text-sm list-disc list-inside">
                    {section.main.points.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                )}
              </div>
              <div className={`rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-6 shadow-sm space-y-3 ${section.reverse ? 'lg:order-first' : ''}`}>
                <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{section.aside.title}</h3>
                {section.aside.content?.map((p, i) => <p key={i} className="text-sm">{p}</p>)}
                {section.aside.points && (
                  <ul className="space-y-2 text-sm list-disc list-inside">
                    {section.aside.points.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Showcase</p>
                <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">Recent ministry builds</h2>
              </div>
              <Link href="/pricing" className="hidden sm:inline-block text-sm font-semibold text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition">View packages →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showcaseProjects.map((project) => (
                <Link
                  key={project.name}
                  href={project.url}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-5 shadow-sm block hover:border-[color:var(--primary)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition"
                  target="_blank"
                  rel="noreferrer"
                >
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">{project.name}</p>
                  <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                    {project.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

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
