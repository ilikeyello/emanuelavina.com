'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const plans = {
  basic: {
    name: 'Basic',
    price: '$299/month',
    features: [
      'Beautiful church website',
      'Mobile-responsive design',
      'Sermon management system',
      'Event calendar',
      'Basic analytics',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$599/month',
    features: [
      'Everything in Basic',
      'Advanced analytics dashboard',
      'Online giving integration',
      'Live streaming support',
      'Member management system',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: '$999/month',
    features: [
      'Everything in Pro',
      'Multi-campus support',
      'Custom app development',
      'API access',
      'Dedicated account manager',
      '24/7 phone support',
    ],
  },
};

export default function CheckoutPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Get the selected plan from sessionStorage
    const plan = sessionStorage.getItem('selectedPlan');
    if (!plan) {
      router.push('/pricing');
      return;
    }
    
    setSelectedPlan(plan);
  }, [isLoaded, router]);

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;
    
    setIsLoading(true);
    
    try {
      // For now, we'll redirect to the questionnaire
      // In a real implementation, you would integrate with Clerk's billing API here
      // to create a subscription checkout session
      router.push('/dashboard/questionnaire');
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[color:var(--primary)]"></div>
      </div>
    );
  }

  const plan = plans[selectedPlan as keyof typeof plans];

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/pricing" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]">
            ← Back to pricing
          </Link>
        </div>

        <div className="bg-[color:var(--card)] rounded-2xl border border-[color:var(--border)] p-8">
          <h1 className="text-3xl font-bold mb-2">Complete your subscription</h1>
          <p className="text-[color:var(--muted-foreground)] mb-8">
            You're signing up for the {plan.name} plan
          </p>

          <div className="bg-[color:var(--muted)]/50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{plan.name} Plan</h2>
            <p className="text-2xl font-bold mb-4">{plan.price}</p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-2">Account Information</h3>
            <p className="text-[color:var(--muted-foreground)]">
              Email: {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </button>

          <p className="text-center mt-4 text-sm text-[color:var(--muted-foreground)]">
            You can cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
