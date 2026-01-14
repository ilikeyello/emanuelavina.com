import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Emanuel Website Design",
  description:
    "Meet Emanuel Website Design—ministry-first web partners delivering calm, reliable church websites with hands-on care.",
};

export default function AboutPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-20 pt-24 sm:px-10 lg:px-16">
        {/* Hero */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            About
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Ministry is your calling. Technology is ours.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            We're web partners who understand church culture because we're part of it. 
            We handle the digital details so you can focus on what matters most—people.
          </p>
        </div>

        {/* What We Do */}
        <section className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur">
          <div className="space-y-6">
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              What We Do
            </h2>
            <p className="text-lg leading-8 text-foreground/80">
              We build and maintain beautiful, peaceful church websites that serve your ministry. 
              From the initial design to weekly sermon uploads, we handle every technical aspect 
              so your digital presence works as smoothly as your Sunday services.
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Complete Digital Ministry Solutions</h3>
              <ul className="space-y-3 text-lg leading-8 text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-200" aria-hidden />
                  <span>Custom website design that reflects your church's unique character</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-200" aria-hidden />
                  <span>Weekly content updates, sermon uploads, and event management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-200" aria-hidden />
                  <span>Secure hosting, backups, and ongoing technical support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-200" aria-hidden />
                  <span>Online giving integration and member communication tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-200" aria-hidden />
                  <span>Monthly reporting with clear next steps to improve engagement</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why We Do It */}
        <section className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur">
          <div className="space-y-6">
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              Why We Do It
            </h2>
            <p className="text-lg leading-8 text-foreground/80">
              Most churches want to reach more people but get stuck managing complicated technology. 
              We've seen too many ministry leaders frustrated by websites that don't work, 
              sermons that never get uploaded, and online systems that confuse rather than connect.
            </p>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">The Gospel Deserves Better</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  The message of hope shouldn't be hidden behind broken links or confusing navigation. 
                  Your website should be a welcoming front door—clear, peaceful, and ready to serve 
                  everyone who walks through it, whether they're searching for hope or looking for service times.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Ministry Leaders Should Minister</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  You're called to shepherd people, not troubleshoot plugins. We believe church leaders 
                  should spend their time in prayer, preparation, and pastoral care—not wrestling with 
                  technology that was supposed to help, not hinder.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Modern Expectations</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  Visitors look for current events, clear service times, and sermons on demand. 
                  When those are missing or outdated, people disengage. We exist to keep that 
                  digital front door open, current, and welcoming every week.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Do It */}
        <section className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur">
          <div className="space-y-6">
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              How We Do It
            </h2>
            <p className="text-lg leading-8 text-foreground/80">
              Our process is built around understanding your ministry and creating solutions that 
              actually work for real churches with real people and real schedules.
            </p>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">We Listen First</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  Every partnership starts with understanding your story, your community, and your challenges. 
                  We learn about your worship style, your communication needs, and the people you're trying to reach.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">We Design for Peace</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  Our design philosophy is "calm technology." We create websites that are peaceful to look at, 
                  easy to navigate, and accessible to everyone—including elderly members and those with disabilities.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">We Handle Everything</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  From domain setup to sermon uploads, we manage it all. You just send us your content, 
                  and we take care of the rest. No plugins to update, no security patches to worry about, 
                  no technical headaches for your team.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">We Support Weekly</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  Ministry happens every week, so we're here every week. Regular updates, ongoing support, 
                  and proactive maintenance ensure your digital presence is always ready when your community needs it.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Clear Timeline & Training</h3>
                <p className="text-lg leading-8 text-foreground/80">
                  Launch typically happens within 4–5 weeks, and we train your team so they feel confident 
                  sending updates. You get a calm, predictable process from kickoff to launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Story */}
        <section className="rounded-3xl border border-border/70 bg-white/80 px-8 py-12 shadow-lg shadow-amber-100/30 backdrop-blur">
          <div className="space-y-6">
            <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl">
              From the Pews to the Pixels
            </h2>
            <div className="space-y-6">
              <p className="text-lg leading-8 text-foreground/80">
                Growing up in a small rural church, I learned that ministry happens in the quiet moments— 
                the prayer before service, the coffee after, the conversations that change lives. 
                I sat in those pews week after week, watching how technology both helped and hindered 
                the work of the church.
              </p>
              <p className="text-lg leading-8 text-foreground/80">
                Living in a rural town taught me the value of community and the importance of being present. 
                It also showed me how smaller churches often struggle with technology—limited budgets, 
                few volunteers with technical skills, and the pressure to appear professional while staying authentic.
              </p>
              <p className="text-lg leading-8 text-foreground/80">
                I started Modern Sanctuary because I believe every church deserves a beautiful, 
                functional website that serves their mission without adding to their burden. 
                Whether you're a rural church of 50 or a growing congregation of 500, your message 
                matters and your people deserve the best digital front door possible.
              </p>
              <p className="text-lg leading-8 text-foreground/80">
                This isn't just web design to me—it's ministry support. I understand church rhythms, 
                respect pastoral priorities, and know that Sunday comes every single week. 
                I'm here to handle the technology so you can handle the people.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
