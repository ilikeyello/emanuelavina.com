'use client';

import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Ministry Suite", 
    price: "$599",
    period: "one-time",
    description: "Comprehensive solution for growing ministries",
    features: [
      "Custom church website design",
      "Mobile-responsive layout",
      "Advanced sermon system",
      "Event calendar & registration",
      "Online giving integration",
      "Member portal access",
      "2 years of hosting",
      "Priority support",
      "Basic SEO setup"
    ],
    cta: "Most Popular",
    popular: true
  },
  {
    name: "Stewardship",
    price: "$999",
    period: "one-time", 
    description: "Complete digital solution for established churches",
    features: [
      "Everything in Ministry Suite",
      "Custom integrations",
      "Advanced analytics",
      "Multi-campus support",
      "3 years of hosting",
      "Dedicated support",
      "Training & onboarding",
      "Advanced SEO & marketing"
    ],
    cta: "Get Started"
  }
];

export function FallbackPricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-2xl border p-8 flex flex-col ${
            plan.popular
              ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/5'
              : 'border-[color:var(--border)] bg-[color:var(--card)]'
          }`}
        >
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
            
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8">
            <Button 
              className={`w-full ${plan.popular ? 'bg-[color:var(--primary)]' : ''}`}
              onClick={() => window.location.href = '/contact'}
            >
              {plan.cta}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
