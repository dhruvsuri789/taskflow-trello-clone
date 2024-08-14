import { RedirectToSignIn } from "@clerk/nextjs";
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
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  // Handle users who aren't authenticated
  if (!auth().userId && !isPublicRoute(request)) {
    return auth().redirectToSignIn({
      returnBackUrl: request.url,
    });
  }

  // Redirect signed in users to organization selection page if they are not active in an organization
  if (
    auth().userId &&
    !auth().orgId &&
    request.nextUrl.pathname !== "/select-org"
  ) {
    const orgSelection = new URL("/select-org", request.url);
    return NextResponse.redirect(orgSelection);
  }

  // Handle users who are authenticated
  if (auth().userId && isPublicRoute(request)) {
    let path = "/select-org";

    if (auth().orgId) {
      path = `/organization/${auth().orgId}`;
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
