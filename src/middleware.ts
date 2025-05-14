import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /communities to /groups
  if (pathname.startsWith("/communities")) {
    return NextResponse.redirect(new URL(pathname.replace("/communities", "/groups"), request.url));
  }

  // Redirect /p/ to /posts/
  if (pathname.startsWith("/p/")) {
    return NextResponse.redirect(new URL(pathname.replace("/p/", "/posts/"), request.url));
  }

  // Redirect /create to /posts/create
  if (pathname === "/create") {
    return NextResponse.redirect(new URL("/posts/create", request.url));
  }

  // Redirect /discover to /explore
  if (pathname.startsWith("/discover")) {
    return NextResponse.redirect(new URL(pathname.replace("/discover", "/explore"), request.url));
  }

  // Redirect /posts/[handle]/* to /posts/[username]/*, but only if the URL explicitly contains "[handle]"
  // This is necessary for NextJS development mode debugging and won't affect production URLs
  if (pathname.includes("/posts/[handle]/")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/posts/[handle]/", "/posts/[username]/"), request.url),
    );
  }

  // Redirect /u/[handle]/* to /u/[username]/*, but only if the URL explicitly contains "[handle]"
  // This is necessary for NextJS development mode debugging and won't affect production URLs
  if (pathname.includes("/u/[handle]/")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/u/[handle]/", "/u/[username]/"), request.url),
    );
  }

  // For real profile URLs (not development mode placeholders)
  if (
    pathname.startsWith("/u/") &&
    !pathname.includes("[handle]") &&
    !pathname.includes("[username]")
  ) {
    // Keep the URL structure the same, just changing the routing underneath
    // This allows us to transition the code without breaking user-facing URLs
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/communities/:path*",
    "/p/:path*",
    "/create",
    "/discover/:path*",
    "/posts/[handle]/:path*",
    "/u/[handle]/:path*",
    "/u/:path*",
  ],
};
