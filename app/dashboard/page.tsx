"use client";

import {
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)] min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-28 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Account
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Church Admin Dashboard
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Manage your church organization, billing, and team access in one place.
          </p>
        </div>

        <SignedOut>
          <div className="rounded-3xl border border-border/70 bg-white/85 px-6 py-10 text-center shadow-md shadow-amber-100/40 backdrop-blur">
            <p className="text-lg text-foreground/80">Please sign in to access your dashboard.</p>
            <div className="mt-4 flex justify-center">
              <SignInButton mode="modal">
                <button className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white/80 px-4 py-3 shadow-sm shadow-amber-100/30 backdrop-blur">
              <div className="flex items-center gap-3">
                <OrganizationSwitcher
                  hidePersonal
                  appearance={{
                    elements: {
                      organizationSwitcherTrigger: "border border-border/60 px-3 py-2 rounded-lg bg-white/80 shadow-sm",
                    },
                  }}
                />
                <div className="flex items-center gap-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />
                  <span className="text-sm text-foreground/70">Profile</span>
                </div>
              </div>
              <div className="text-sm text-foreground/70">
                Tip: Use the org switcher to pick which church you’re managing.
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-white/85 p-6 shadow-md shadow-amber-100/30 backdrop-blur">
                <h2 className="text-xl font-semibold text-foreground">Organizations</h2>
                <p className="mt-2 text-sm text-foreground/70">
                  Create or switch churches. Each church has its own billing and content.
                </p>
                <div className="mt-4">
                  <OrganizationList
                    hidePersonal
                    appearance={{
                      elements: {
                        organizationListContainer: "rounded-2xl border border-border/60 bg-white/80",
                        organizationList: "p-3",
                        organizationListItem: "rounded-xl border border-transparent hover:border-border/80",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-white/85 p-6 shadow-md shadow-amber-100/30 backdrop-blur">
                <h2 className="text-xl font-semibold text-foreground">Organization Profile & Billing</h2>
                <p className="mt-2 text-sm text-foreground/70">
                  Manage members, roles, and billing. Clerk Billing beta will surface here when enabled in your Clerk dashboard.
                </p>
                <div className="mt-4 rounded-2xl border border-border/70 bg-white">
                  <OrganizationProfile
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "overflow-hidden rounded-2xl",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
