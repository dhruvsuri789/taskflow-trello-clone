import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// This middleware protects all routes except for the public routes
// These all are public routes that can accessed by anyone
// This is different from the middleware in Next Auth where we provide the private routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, request) => {
  // Protect private routes
  // If the route is not among the public routes then protect it
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  const { userId, orgId } = auth();

  // Handle users who aren't authenticated and are not public routes
  if (!userId && !isPublicRoute(request)) {
    return auth().redirectToSignIn({
      returnBackUrl: request.url,
    });
  }

  // Redirect signed in users to organization selection page if they are not active in an organization
  if (userId && !orgId && request.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", request.url);
    return NextResponse.redirect(orgSelection);
  }

  // Handle users who are authenticated to either redirect to organization selection page or home page if they are active in an organization
  if (userId && isPublicRoute(request)) {
    let path = "/select-org";

    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, request.url);
    return NextResponse.redirect(orgSelection);
  }
});

// This middleware protects all routes except for the public routes
// const isPublicRoute = createRouteMatcher(["/"]);
// const isPrivateRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isPublicRoute(req)) return; // if it's a public route, do nothing
//   else if (isPrivateRoute(req)) auth().protect(); // if it's a private route, require auth
//   // auth().protect(); // for any other route, require auth
// });
