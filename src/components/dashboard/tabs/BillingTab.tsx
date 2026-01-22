'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle } from 'lucide-react';

interface BillingTabProps {
  orgId: string;
}

export default function BillingTab({ orgId }: BillingTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription & Billing
          </CardTitle>
          <CardDescription>
            Manage your subscription plan and payment methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Stripe Integration Coming Soon</h3>
              <p className="text-sm text-blue-700 mt-1">
                Subscription management and billing features will be available once Stripe is integrated.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Current Plan</h3>
              <p className="text-sm text-gray-600">Free Trial</p>
              <p className="text-xs text-gray-500 mt-1">All features included during trial period</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-sm text-gray-600">No payment method on file</p>
              <Button variant="outline" className="mt-3" disabled>
                Add Payment Method
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Billing History</h3>
              <p className="text-sm text-gray-600">No billing history available</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Questions about billing? Contact support at{' '}
              <a href="mailto:support@emanuelavina.com" className="text-blue-600 hover:underline">
                support@emanuelavina.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
