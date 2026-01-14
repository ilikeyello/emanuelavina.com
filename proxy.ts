import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/portfolio",
  "/pricing",
  "/contact",
  "/payment",
  "/api/webhooks/clerk",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (isPublicRoute(request)) return NextResponse.next();

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: request.url });
  }

  return NextResponse.next();
});
