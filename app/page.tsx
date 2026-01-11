import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] text-foreground">
      {/* Hero full-bleed */}
      <section className="relative isolate min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1616593768589-3641738a2e21?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Light-filled modern church exterior against blue sky"
            fill
            className="object-cover scale-110 blur-[0.75px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/18 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#f9f9f7]/55 to-[#f9f9f7]" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20 sm:px-10 lg:px-16">
          <div className="space-y-8 text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
            <h1 className="font-[var(--font-playfair)] text-4xl leading-tight sm:text-5xl">
              You connect the world to God&apos;s love. We connect you to the world.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/90">
              For most people, your website is the first hand your community shakes before
              they ever step into the sanctuary. We make that first touch warm, clear, and
              easy to follow.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/pricing"
                className="rounded-full bg-white px-6 py-3 text-base font-semibold text-foreground transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                View pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        {/* Mission / Problem / Solution */}
        <section
          id="problem"
          className="grid gap-10 rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur lg:grid-cols-2"
        >
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              Mission & Presence
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              Ministry is your calling. Making it visible is ours.
            </h2>
            <p className="text-lg leading-8 text-foreground/80">
              The Gospel is timeless, but the way people find it has changed. Most
              visitors meet your church through a screen long before they ever walk
              through your doors. Your online presence should echo the same welcome,
              clarity, and care they feel in person.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Digital Generosity",
                body: "Clear, trustworthy giving paths that make it simple to support the mission from anywhere.",
              },
              {
                title: "The Living Word",
                body: "Sermons and teaching organized, searchable, and easy to revisit throughout the week.",
              },
              {
                title: "Your Church, Anywhere",
                body: "A calm, mobile-first experience so your community can stay connected on every device.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-amber-50/60 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-foreground/80">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="rounded-3xl border border-border/70 bg-white/85 px-8 py-12 shadow-xl shadow-amber-100/40 backdrop-blur"
        >
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              Partnership
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              $99/mo Managed Partnership
            </h2>
            <p className="text-base leading-7 text-foreground/80">
              $299 one-time setup. Our most popular option for churches that want calm,
              ongoing website care without hiring a full-time staff member.
            </p>
          </div>
          <div className="mt-8 grid gap-4 text-left md:grid-cols-[1.4fr_1fr] md:items-center">
            <ul className="space-y-3 text-base leading-7 text-foreground/85">
              {[
                "Weekly content updates and sermon uploads handled for you.",
                "High-speed hosting, SSL, backups, and accessibility-minded design.",
                "Event calendar and secure giving links kept current.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-700"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-4 text-left md:text-right">
              <p className="text-sm text-foreground/70">
                Includes professional setup, SEO optimization, and domain connection.
              </p>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <a
                  href="#contact"
                  className="rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  Start partnership
                </a>
                <a
                  href="/pricing"
                  className="rounded-full border border-foreground/20 px-6 py-3 text-base font-semibold text-foreground transition hover:border-foreground/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60"
                >
                  See packages
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="grid gap-8 rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              About
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              We keep churches focused on ministry while we handle the technology.
            </h2>
            <p className="text-lg leading-8 text-foreground/80">
              From launch to weekly care, we steward your digital presence with the same
              reverence you bring to Sunday services. Reliable updates, calm design, and
              a support team that knows church rhythms.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-amber-50/60 shadow-sm">
            <div className="relative h-full">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
                alt="Peaceful nature scene conveying calm and renewal"
                width={1400}
                height={1000}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="space-y-3 p-6 text-background">
                  <div className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-100">
                    How we serve
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Content concierge for events, sermons, and announcements.",
                      "Mobile-first layouts tuned for every age group.",
                      "Search-friendly structure so visitors find you.",
                      "Peaceful visuals that echo your sanctuary.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-lg leading-8">
                        <span
                          className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-200"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="contact"
          className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-white/85 px-8 py-10 text-lg leading-8 text-foreground/80 shadow-lg shadow-amber-100/30 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-foreground">Modern Sanctuary Agency</p>
            <p>Built for the Kingdom.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Email", href: "mailto:hello@modern-sanctuary.agency" },
              { label: "Book a call", href: "https://cal.com" },
              { label: "Portfolio", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full border border-foreground/20 px-5 py-2 text-base font-semibold text-foreground transition hover:border-foreground/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60"
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
