"use client";

import { Suspense, useState, useEffect } from "react";
import {
  OrganizationProfile,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ChurchContentManager } from "@/components/church-content-manager";
import { Loader2, Church, Settings } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { organization } = useOrganization();


  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)] min-h-screen overflow-x-hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-28 sm:px-6 md:px-10 lg:px-16 w-full overflow-x-hidden">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Account
          </p>
          <h1 className="font-[var(--font-playfair)] text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Church Admin Dashboard
          </h1>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-foreground/80">
            Manage your church organization and team access in one place.
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
          <div className="flex flex-col gap-6 overflow-x-hidden w-full">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-white/80 px-4 py-3 shadow-sm shadow-amber-100/30 backdrop-blur overflow-x-hidden w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{organization?.name || "Church Admin"}</span>
                    <span className="text-xs text-foreground/60">Profile Settings</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-white/85 p-0 sm:p-6 shadow-md shadow-amber-100/30 backdrop-blur overflow-x-hidden w-full">
              <Tabs
                defaultTab="church"
                tabs={[
                  {
                    id: "church",
                    label: (
                      <span className="flex items-center gap-2">
                        <Church className="h-4 w-4" />
                        Church
                      </span>
                    ),
                    content: (
                      <div className="px-4 sm:px-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Church Content</h2>
                        <p className="text-sm text-foreground/70 mb-6">
                          Manage your church content and settings.
                        </p>
                        <ChurchContentManager />
                      </div>
                    ),
                  },
                  {
                    id: "organization",
                    label: (
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Organization
                      </span>
                    ),
                    content: (
                      <div className="px-4 sm:px-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Organization Details</h2>
                        <p className="text-sm text-foreground/70 mb-6">
                          Manage your church settings and team members.
                        </p>
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-border/70 bg-white p-3 sm:p-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">Church Name</p>
                                <p className="mt-1 text-sm text-foreground/70">{organization?.name || "Loading..."}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">Organization ID</p>
                                <p className="mt-1 text-xs text-foreground/50 font-mono">{organization?.id || "Loading..."}</p>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-border/70 bg-white overflow-hidden">
                            <OrganizationProfile
                              routing="hash"
                              appearance={{
                                elements: {
                                  rootBox: "overflow-hidden rounded-2xl max-w-full",
                                  card: "max-w-full overflow-x-hidden",
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ),
                ]}
              />
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#f9f9f7]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
