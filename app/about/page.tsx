import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Modern Sanctuary Agency",
  description:
    "Meet the Modern Sanctuary team—web designers focused on helping churches stay ministry-first while we handle technology.",
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
            
            {/* Service Distribution Chart */}
            <div className="grid gap-8 lg:grid-cols-2">
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
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Service Focus</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Design & Development', value: 35, color: 'bg-amber-500' },
                    { label: 'Content Management', value: 30, color: 'bg-blue-500' },
                    { label: 'Technical Support', value: 20, color: 'bg-green-500' },
                    { label: 'Strategy & Consulting', value: 15, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-foreground/70">{item.value}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-amber-100 overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            
            {/* Impact Visualization */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">The Problem We Solve</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">The Gospel Deserves Better</h4>
                    <p className="text-lg leading-8 text-foreground/80">
                      The message of hope shouldn't be hidden behind broken links or confusing navigation. 
                      Your website should be a welcoming front door—clear, peaceful, and ready to serve 
                      everyone who walks through it, whether they're searching for hope or looking for service times.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Ministry Leaders Should Minister</h4>
                    <p className="text-lg leading-8 text-foreground/80">
                      You're called to shepherd people, not troubleshoot plugins. We believe church leaders 
                      should spend their time in prayer, preparation, and pastoral care—not wrestling with 
                      technology that was supposed to help, not hinder.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Church Technology Challenges</h3>
                <div className="relative h-64 w-full">
                  {/* Pie Chart */}
                  <svg viewBox="0 0 200 200" className="h-full w-full">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="40"
                      strokeDasharray="125.6 376.8"
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-1000 ease-out"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="40"
                      strokeDasharray="100.48 401.92"
                      strokeDashoffset="-125.6"
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-1000 ease-out"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="40"
                      strokeDasharray="75.36 427.04"
                      strokeDashoffset="-226.08"
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-1000 ease-out"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="40"
                      strokeDasharray="50.24 452.16"
                      strokeDashoffset="-301.44"
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-1000 ease-out"
                    />
                    <text x="100" y="100" textAnchor="middle" className="text-2xl font-bold fill-foreground">
                      100%
                    </text>
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span>Outdated Sites (33%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span>No Updates (27%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span>Poor Accessibility (20%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span>Security Issues (20%)</span>
                  </div>
                </div>
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
            
            {/* Process Timeline */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'We Listen First',
                    description: 'Every partnership starts with understanding your story, your community, and your challenges.',
                    color: 'bg-amber-500'
                  },
                  {
                    step: '2',
                    title: 'We Design for Peace',
                    description: 'Our design philosophy is "calm technology." We create websites that are peaceful to look at.',
                    color: 'bg-blue-500'
                  },
                  {
                    step: '3',
                    title: 'We Handle Everything',
                    description: 'From domain setup to sermon uploads, we manage it all. You just send us your content.',
                    color: 'bg-green-500'
                  },
                  {
                    step: '4',
                    title: 'We Support Weekly',
                    description: 'Ministry happens every week, so we\'re here every week with regular updates and support.',
                    color: 'bg-purple-500'
                  },
                ].map((item, index) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold`}>
                        {item.step}
                      </div>
                      {index < 3 && <div className="h-8 w-0.5 bg-border/60 mt-2" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="text-base leading-7 text-foreground/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Time Investment</h3>
                <div className="space-y-3">
                  {[
                    { phase: 'Discovery & Planning', weeks: 1, color: 'bg-amber-500' },
                    { phase: 'Design & Development', weeks: 2, color: 'bg-blue-500' },
                    { phase: 'Content & Setup', weeks: 1, color: 'bg-green-500' },
                    { phase: 'Launch & Training', weeks: 1, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.phase} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.phase}</span>
                        <span className="text-foreground/70">{item.weeks} week{item.weeks > 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${(item.weeks / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900">
                    <strong>Total Timeline:</strong> 5 weeks from start to launch
                  </p>
                </div>
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
