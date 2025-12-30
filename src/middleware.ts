import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // ✅ DO NOT run middleware on API routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedRoutes = [
    "/companies",
    "/resources",
    "/search",
  ];

  if (
    protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    ) &&
    !user
  ) {
    return NextResponse.redirect(
      new URL("/auth/signup", req.url)
    );
  }

  return res;
}
