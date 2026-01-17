"use client";

import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard, ExternalLink } from "lucide-react";

interface BillingManagerProps {
  subscriptionPlan?: string | null;
  subscriptionStatus?: string | null;
}

export function BillingManager({ 
  subscriptionPlan, 
  subscriptionStatus 
}: BillingManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { organization } = useOrganization();

  const handleManageBilling = async () => {
    if (!organization) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkOrgId: organization.id,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  if (!subscriptionPlan || subscriptionStatus === 'canceled') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-amber-900">
              No active subscription
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Choose a plan to unlock all features
            </p>
            <button
              onClick={handleUpgrade}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View plans
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const planDetails = {
    basic: {
      name: 'The Digital Front Door',
      price: '$50/mo',
    },
    growth: {
      name: 'The Gospel Outreach',
      price: '$99/mo',
    },
    premium: {
      name: 'The Ministry Ecosystem',
      price: '$99/mo',
    },
  };

  const currentPlan = planDetails[subscriptionPlan as keyof typeof planDetails];

  return (
    <div className="space-y-4 overflow-x-hidden w-full">
      <div className="rounded-lg border bg-white p-4 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">Current Plan</p>
            <p className="mt-1 text-sm text-foreground/60">
              {currentPlan?.name} - {currentPlan?.price}
            </p>
            <p className="mt-1 text-xs text-foreground/40">
              Status: {subscriptionStatus || 'Active'}
            </p>
          </div>
          <button
            onClick={handleManageBilling}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50 w-full sm:w-auto shrink-0"
          >
            {isLoading ? 'Loading...' : 'Manage Billing'}
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {subscriptionPlan !== 'premium' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="font-medium text-blue-900">Ready to upgrade?</p>
          <p className="mt-1 text-sm text-blue-700">
            Unlock more features with a higher tier plan
          </p>
          <button
            onClick={handleUpgrade}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View upgrade options
          </button>
        </div>
      )}
    </div>
  );
}
