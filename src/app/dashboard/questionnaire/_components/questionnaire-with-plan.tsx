'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireForm } from './questionnaire-form';

interface QuestionnaireWithPlanProps {
  userId: string;
  orgId: string;
}

const plans = {
  basic: {
    name: 'Basic',
    price: '$299/month',
  },
  pro: {
    name: 'Pro',
    price: '$599/month',
  },
  enterprise: {
    name: 'Enterprise',
    price: '$999/month',
  },
};

export default function QuestionnaireWithPlan({ userId, orgId }: QuestionnaireWithPlanProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);

  useEffect(() => {
    // Check if there's a pending plan from sessionStorage
    const plan = sessionStorage.getItem('dealtPlan');
    if (plan) {
      setSelectedPlan(plan);
      setShowCheckoutPrompt(true);
    }
  }, []);

  const handleProceedToCheckout = () => {
    router.push('/dashboard/checkout');
  };

  const handleSkipForNow = () => {
    setShowCheckoutPrompt(false);
    sessionStorage.removeItem('dealtPlan');
  };

  if (showCheckoutPrompt && selectedPlan) {
    const plan = plans[selectedPlan as keyof typeof plans];

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[color:var(--card)] rounded-2xl border border-[color:var(--border)] p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Complete your subscription</h2>
          <p className="text-[color:var(--muted-foreground)] mb-6">
            You selected the {plan.name} plan ({plan.price}). Complete your subscription to continue.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={handleProceedToCheckout}
              className="inline-flex items-center justify-center text-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
            >
              Complete Subscription
            </button>
            <button
              onClick={handleSkipForNow}
              className="inline-flex items-center justify-center text-center px-6 py-3 rounded-full border border-[color:var(--foreground)]/80 text-base font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-serif font-bold">Onboarding Questionnaire</h1>
        <p className="text-lg text-[color:var(--muted-foreground)]">
          Welcome! Please fill out this form to help me get started on your new website.
        </p>
      </div>
      <div className="mt-10">
        <QuestionnaireForm />
      </div>
    </div>
  );
}
