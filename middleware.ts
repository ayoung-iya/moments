import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

const PUBLIC_URLS = new Set(["/", "/login", "/create-account"]);

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isPublicPath = PUBLIC_URLS.has(request.nextUrl.pathname);

  if (!(session.id || isPublicPath)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session.id && isPublicPath) {
    return NextResponse.redirect(new URL("/tweet", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
