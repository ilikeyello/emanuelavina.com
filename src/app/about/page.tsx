import Link from "next/link";
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export const metadata = {
  title: "About | Emanuel Web Design",
  description: "Learn about my approach to building peaceful, accessible church websites for local ministries.",
};

const aboutSections = [
  {
    main: {
      title: "My Story",
      content: [
        "I grew up in my dad’s church right here in Yuma, Colorado. Sundays meant stacking chairs, running sound, and watching how small acts of service made ministry possible. That experience is at the heart of how I build today: practical, calm, and always dependable.",
        "I speak the language of pastors and volunteers because I've been there. My goal is to give you clear next steps and technology that disappears, so you can focus on the message.",
      ],
    },
    aside: {
      title: "Local Roots",
      points: [
        "Raised in Yuma, serving churches across NE Colorado",
        "I understand rural rhythms and volunteer-led teams",
        "My designs feel welcoming, not corporate",
      ],
    },
    reverse: false,
  },
  {
    main: {
      title: "What I Offer",
      points: [
        "Modern websites built with Next.js, Tailwind, and Sanity for easy content management.",
        "A personal Client Portal for updates, billing, and uploads—no more lost emails.",
        "Full support for sermons, events, devotionals, livestreams, and giving.",
        "I handle all the technical stuff: hosting, security, backups, and monitoring.",
      ],
    },
    aside: {
      title: "Why Not DIY?",
      content: [
        "DIY builders cost time you don’t have and often miss crucial accessibility standards. I provide a local partnership, which means faster support, sensible defaults, and a design that fits your congregation—not a generic template.",
      ],
    },
    reverse: true,
  },
];

const showcaseProjects = [
  {
    name: "Centro de Nueva Esperanza",
    location: "Yuma, CO",
    description: "A complete redesign for my home church, featuring a bilingual interface, a new sermon archive, and clear, accessible giving paths to support their ministry.",
    url: "https://cnechurch.vercel.app/",
    img: "/img/cne-showcase.png",
  },
  {
    name: "Sterling Community Church",
    location: "Sterling, CO",
    description: "A new build focused on community engagement, with a prominent events calendar, integrated music playlists, and a streamlined system for prayer requests.",
    url: "#",
    img: "/img/sterling-showcase.png",
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
              I'm Emanuel, a web designer and church consultant from rural Colorado.
            </h1>
            <p className="text-lg text-[color:var(--muted-foreground)]">
              I build peaceful, reliable websites so your ministry can thrive online.
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
                <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">Ministry Showcase</h2>
              </div>
              <Link href="/pricing" className="hidden sm:inline-block text-sm font-semibold text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition">View packages →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showcaseProjects.map((project) => (
                <Link
                  key={project.name}
                  href={project.url}
                  className="group rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 shadow-sm block hover:border-[color:var(--primary)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition overflow-hidden"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={project.img} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">{project.name}</p>
                    <p className="text-xs text-[color:var(--muted-foreground)] font-medium tracking-wider uppercase">{project.location}</p>
                    <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold">Ready to modernize your church’s digital front door?</h2>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                Tell me about your congregation, and I’ll handle the technical details—the site, the dashboard, and the support—so you can stay focused on your ministry.
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
