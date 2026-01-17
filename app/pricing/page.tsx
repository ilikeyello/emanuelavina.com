"use client";

import { useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";

export default function PricingPage() {
  const [openPackage, setOpenPackage] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const { organization } = useOrganization();

  const handlePackageClick = (packageName: string) => {
    setOpenPackage(openPackage === packageName ? null : packageName);
  };

  const handlePurchase = async (plan: string, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    if (!isSignedIn || !organization) {
      // Redirect to sign in
      window.location.href = '/sign-in?redirect_url=/pricing';
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          clerkOrgId: organization.id,
          billingCycle,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-20 pt-24 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Partnership
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Simple packages for every church.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Calm, reliable web presence—built and cared for weekly so your team can stay
            focused on ministry. Every tier includes professional setup, SEO, and domain
            connection.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          {/* The Digital Front Door */}
          <div className="rounded-3xl border border-border/70 bg-white/90 p-5 text-left shadow-sm shadow-amber-100/60">
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
              onClick={() => handlePackageClick('digital-front-door')}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  The Digital Front Door
                </p>
                <p className="mt-1 font-[var(--font-playfair)] text-2xl text-foreground">
                  $299 Setup
                </p>
                <p className="text-lg font-bold text-foreground/90">$50/mo</p>
                <p className="mt-2 text-base font-medium text-foreground/70">Presence</p>
                <p className="mt-2 text-base leading-6 text-foreground/90 font-medium">
                  Stop being invisible to your community. We build a professional, welcoming space so that when people look for a church, they find yours.
                </p>
              </div>
              <span className="text-sm font-medium text-foreground/70">
                {openPackage === 'digital-front-door' ? 'Hide details' : 'Click to see details'}
              </span>
            </button>
            {openPackage === 'digital-front-door' && (
              <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
                <p>
                  Your church's digital presence starts here. A clean, professional website that makes your church visible and approachable to anyone searching online.
                </p>
                <p>
                  Includes everything you need to establish a strong online presence with minimal maintenance.
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Mobile-friendly, high-contrast design for accessibility</li>
                  <li>Essential pages: Home, About, Services, Contact</li>
                  <li>Basic service times and location information</li>
                  <li>Contact form and basic prayer request functionality</li>
                  <li>Secure hosting with weekly backups</li>
                  <li>Basic SEO optimization for local search</li>
                  <li>Domain connection and SSL certificate</li>
                </ul>
                <div className="pt-3">
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePurchase('basic', 'monthly')}
                      className="w-full inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      Purchase Digital Front Door - $50/mo
                    </button>
                    <button
                      onClick={() => handlePurchase('basic', 'yearly')}
                      className="w-full inline-flex items-center justify-center rounded-full border-2 border-foreground bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      Purchase Yearly - $500/year (Save 17%)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* The Gospel Outreach (Most Popular) */}
          <div className="relative rounded-3xl border border-amber-600 bg-amber-100/90 p-5 text-left shadow-md shadow-amber-200">
            <div className="pointer-events-none absolute -top-3 right-4 rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-50">
              Most Popular
            </div>
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
              onClick={() => handlePackageClick('gospel-outreach')}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
                  The Gospel Outreach
                </p>
                <p className="mt-1 font-[var(--font-playfair)] text-2xl text-foreground">
                  $299 Setup
                </p>
                <p className="text-lg font-bold text-foreground/90">$99/mo</p>
                <p className="mt-2 text-base font-medium text-foreground/70">Spreading the Word</p>
                <p className="mt-2 text-base leading-6 text-foreground/90 font-medium">
                  Don't let the message stop at the church doors. We equip you with sermon archiving, online giving, and event management to reach people wherever they are.
                </p>
              </div>
              <span className="text-sm font-medium text-foreground/70">
                {openPackage === 'gospel-outreach' ? 'Hide details' : 'Click to see details'}
              </span>
            </button>
            {openPackage === 'gospel-outreach' && (
              <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
                <p>
                  Extend your ministry beyond Sunday morning. This package equips your church with digital tools to share the Gospel and engage your community throughout the week.
                </p>
                <p>
                  Perfect for churches ready to expand their reach and provide ongoing spiritual nourishment online.
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Everything in The Digital Front Door</li>
                  <li>Sermon archiving with audio and video support</li>
                  <li>Online giving platform with recurring donations</li>
                  <li>Event calendar with registration capabilities</li>
                  <li>Blog or news section for announcements</li>
                  <li>Staff directory and ministry team pages</li>
                  <li>Advanced SEO and Google Analytics setup</li>
                  <li>Weekly content updates and sermon uploads</li>
                </ul>
                <div className="pt-3">
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePurchase('growth', 'monthly')}
                      className="w-full inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      Purchase Gospel Outreach - $99/mo
                    </button>
                    <button
                      onClick={() => handlePurchase('growth', 'yearly')}
                      className="w-full inline-flex items-center justify-center rounded-full border-2 border-foreground bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      Purchase Yearly - $990/year (Save 17%)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* The Ministry Ecosystem */}
          <div className="rounded-3xl border border-border/70 bg-white/90 p-5 text-left shadow-sm shadow-amber-100/60">
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
              onClick={() => handlePackageClick('ministry-ecosystem')}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  The Ministry Ecosystem
                </p>
                <p className="mt-1 font-[var(--font-playfair)] text-2xl text-foreground">
                  $799 Setup
                </p>
                <p className="text-lg font-bold text-foreground/90">$99/mo</p>
                <p className="mt-2 text-base font-medium text-foreground/70">Advanced Engagement</p>
                <p className="mt-2 text-base leading-6 text-foreground/90 font-medium">
                  The full digital companion for your congregation. A powerful web app featuring Bible integration and worship playlists for daily discipleship.
                </p>
              </div>
              <span className="text-sm font-medium text-foreground/70">
                {openPackage === 'ministry-ecosystem' ? 'Hide details' : 'Click to see details'}
              </span>
            </button>
            {openPackage === 'ministry-ecosystem' && (
              <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
                <p>
                  Transform your website into a comprehensive digital ministry platform. This ecosystem provides daily discipleship tools and deep engagement opportunities.
                </p>
                <p>
                  Ideal for established churches seeking to create a vibrant online community and support spiritual growth throughout the week.
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Everything in The Gospel Outreach</li>
                  <li>Integrated Bible study tools and reading plans</li>
                  <li>Worship playlist integration with Spotify/Apple Music</li>
                  <li>Small group management and communication tools</li>
                  <li>Volunteer scheduling and management system</li>
                  <li>Member portal with personalized content</li>
                  <li>Live streaming integration and archives</li>
                  <li>Mobile app companion for iOS and Android</li>
                  <li>Advanced analytics and engagement tracking</li>
                  <li>Priority support and monthly strategy calls</li>
                </ul>
                <div className="pt-3">
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePurchase('premium', 'monthly')}
                      className="w-full inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      Purchase Ministry Ecosystem - $99/mo
                    </button>
                    <button
                      onClick={() => handlePurchase('premium', 'yearly')}
                      className="w-full inline-flex items-center justify-center rounded-full border-2 border-foreground bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      Purchase Yearly - $990/year (Save 17%)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
