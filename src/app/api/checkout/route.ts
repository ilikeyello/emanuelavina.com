import { NextResponse } from "next/server";

// Clerk billing API endpoint
const CLERK_BILLING_API = "https://api.clerk.com/v1/billing/checkout_sessions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const planId = url.searchParams.get("planId");

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    console.error("CLERK_SECRET_KEY is not set");
    return NextResponse.json({ error: "Missing CLERK_SECRET_KEY" }, { status: 500 });
  }

  const origin = url.origin;
  const successUrl = `${origin}/dashboard/client-portal`;
  const cancelUrl = `${origin}/pricing`;

  console.log("Starting checkout with:", {
    planId,
    secretKey: secretKey.substring(0, 10) + "...",
    successUrl,
    cancelUrl,
  });

  try {
    const response = await fetch(CLERK_BILLING_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        // Additional fields that might be required
        return_url: successUrl,
      }),
    });

    console.log("Clerk API response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("Clerk API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: text,
      });
      
      // Special handling for 404 - likely billing not enabled
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: "Clerk Billing is not enabled", 
            status: response.status,
            message: "Please enable Clerk Billing in your Clerk dashboard at https://dashboard.clerk.com. Go to Billing > Enable Billing and set up your payment gateway.",
            details: {
              planId,
              apiEndpoint: CLERK_BILLING_API,
              instructions: [
                "1. Go to your Clerk Dashboard",
                "2. Navigate to Billing section",
                "3. Click 'Enable Billing'",
                "4. Set up your payment gateway (Stripe)",
                "5. Create subscription plans",
                "6. Update plan IDs in your pricing page"
              ]
            }
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Unable to start checkout", 
          status: response.status, 
          body: text,
          details: {
            planId,
            apiEndpoint: CLERK_BILLING_API,
          }
        },
        { status: 500 }
      );
    }

    const data = (await response.json()) as { url?: string };
    console.log("Clerk API response:", data);
    
    if (!data.url) {
      return NextResponse.json({ 
        error: "No checkout URL returned from Clerk",
        response: data
      }, { status: 500 });
    }

    return NextResponse.redirect(data.url, { status: 302 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ 
      error: "Checkout failed", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
