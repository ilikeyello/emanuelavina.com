import { NextResponse } from "next/server";

const CLERK_BILLING_API = "https://api.clerk.com/v1/billing/checkout_sessions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const planId = url.searchParams.get("planId");

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Missing CLERK_SECRET_KEY" }, { status: 500 });
  }

  const origin = url.origin;
  const successUrl = `${origin}/dashboard/client-portal`;
  const cancelUrl = `${origin}/pricing`;

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
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Unable to start checkout", status: response.status, body: text },
        { status: 500 }
      );
    }

    const data = (await response.json()) as { url?: string };
    if (!data.url) {
      return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 });
    }

    return NextResponse.redirect(data.url, { status: 302 });
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
