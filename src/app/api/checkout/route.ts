import { NextResponse } from "next/server";

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

  // Extract the instance ID from the secret key to build the correct API URL
  const instanceId = secretKey.split('_')[1];
  if (!instanceId) {
    return NextResponse.json({ error: "Invalid CLERK_SECRET_KEY format" }, { status: 500 });
  }

  const origin = url.origin;
  const successUrl = `${origin}/dashboard/client-portal`;
  const cancelUrl = `${origin}/pricing`;

  console.log("Starting checkout with:", {
    planId,
    instanceId,
    successUrl,
    cancelUrl,
  });

  try {
    // Use instance-specific API endpoint
    const apiUrl = `https://api.clerk.com/v1/instances/${instanceId}/billing/checkout_sessions`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        return_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });

    console.log("Clerk API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Clerk API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      
      // Handle specific error codes
      if (errorData.code === 'billing_not_enabled') {
        return NextResponse.json(
          { 
            error: "Billing not enabled for this instance type", 
            message: errorData.longMessage || "Billing is not enabled",
            code: errorData.code,
            details: {
              planId,
              instanceId,
              instructions: [
                "1. Go to Clerk Dashboard > Billing",
                "2. Enable billing for Users (not just Organizations)",
                "3. Configure your payment gateway",
                "4. Verify your plans are active"
              ]
            }
          },
          { status: 403 }
        );
      }
      
      if (errorData.code === 'billing_plan_is_hidden') {
        return NextResponse.json(
          { 
            error: "Plan is not publicly available", 
            message: "The plan ID you're using is hidden and not available for checkout",
            code: errorData.code,
            details: { planId }
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Unable to start checkout", 
          status: response.status,
          body: errorData,
          details: {
            planId,
            instanceId,
            apiUrl,
          }
        },
        { status: 500 }
      );
    }

    const data = await response.json();
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
