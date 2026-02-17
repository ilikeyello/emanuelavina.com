'use client';

import { useState, useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'basic';
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  
  const [redirectUrlWithPlan, setRedirectUrlWithPlan] = useState('/dashboard/questionnaire');

  useEffect(() => {
    // Store the selected plan in sessionStorage to retrieve after sign-up
    if (plan) {
      sessionStorage.setItem('selectedPlan', plan);
    }
    
    // Set the redirect URL for after sign-up
    setRedirectUrlWithPlan('/dashboard/questionnaire');
  }, [plan]);

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-[color:var(--muted-foreground)]">
              Get started with your {plan} plan
            </p>
          </div>

          <div className="bg-[color:var(--card)] rounded-2xl border border-[color:var(--border)] p-8">
            <SignUp 
              redirectUrl={redirectUrlWithPlan}
              afterSignUpUrl="/dashboard/questionnaire"
            />
          </div>

          <p className="text-center mt-6 text-sm text-[color:var(--muted-foreground)]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[color:var(--primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
