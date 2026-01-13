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
            <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-white sm:text-5xl">
              You connect the world to God&apos;s love. We connect you to the world.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/90">
              For most people, your website is the first hand your community shakes before
              they ever step into the sanctuary. We make that first touch warm, clear, and
              easy to follow.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/about"
                className="rounded-full bg-white px-6 py-3 text-base font-semibold text-foreground transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                Learn More
              </a>
              <a
                href="/pricing"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20 hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                View Packages
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        {/* Mission & Presence */}
        <section
          id="problem"
          className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur"
        >
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
                What We Do
              </p>
              <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
                Ministry is your calling. Making it visible is ours.
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">We Build Your Digital Front Door</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  Most people meet your church through a screen long before they walk through your doors. 
                  We create a warm, professional website that welcomes visitors, shares your mission, 
                  and makes it easy for them to connect with your community.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">We Handle the Technology So You Don't Have To</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  From secure hosting and sermon uploads to calendar updates and prayer requests, 
                  we manage all the technical details. Your team stays focused on ministry while 
                  we ensure your website stays fresh, functional, and found by those searching for hope.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">We Speak Your Language</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  We understand church culture and ministry priorities. We don't just build websites— 
                  we build digital ministry tools that serve your mission, honor your values, and 
                  help you reach more people with the Gospel.
                </p>
              </div>
            </div>
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
          className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur"
        >
          <div className="mx-auto max-w-4xl space-y-4">
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
            <div className="space-y-3 pt-4">
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
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
        </section>

        {/* Scripture */}
        <section className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              Scripture
            </p>
            <blockquote className="font-[var(--font-playfair)] text-2xl leading-tight text-foreground sm:text-3xl italic">
              "And he said to them, 'Go into all the world and proclaim the gospel to the whole creation.'"
            </blockquote>
            <cite className="text-lg text-foreground/70">
              — Mark 16:15
            </cite>
          </div>
        </section>
      </div>
    </main>
  );
}
