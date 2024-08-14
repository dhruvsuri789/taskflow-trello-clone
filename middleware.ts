import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
});

// This middleware protects all routes except for the public routes
// const isPublicRoute = createRouteMatcher(["/"]);
// const isPrivateRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isPublicRoute(req)) return; // if it's a public route, do nothing
//   else if (isPrivateRoute(req)) auth().protect(); // if it's a private route, require auth
//   // auth().protect(); // for any other route, require auth
// });
