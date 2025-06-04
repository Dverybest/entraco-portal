import { getToken, JWT } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CookieType } from "./cookieType";


interface Token extends JWT {
  role: UserRole;
}

const ALLOWED_ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  SCAN: "/scan-vehicles",
} as const;

const ROLE_PERMISSIONS = {
  super_admin: {
    allowedRoutes: ["*"] as string[], // Super admin can access all routes
    defaultRoute: ALLOWED_ROUTES.HOME,
  },
  admin: {
    allowedRoutes: ["/scan-vehicles", "/scan-vehicles/[id]"] as string[], // Admin can only access scan routes
    defaultRoute: ALLOWED_ROUTES.SCAN,
  },
} as const;

type UserRole = keyof typeof ROLE_PERMISSIONS;

function isTokenExpired(token: Token): boolean {
  if (!token?.exp) return true;
  return Date.now() >= (token.exp as number) * 1000;
}


function hasRoutePermission(role: UserRole, pathname: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  
  if (permissions.allowedRoutes.includes("*")) {
    return true;
  }
  
  return permissions.allowedRoutes.some(route => {
    // Handle dynamic routes like /scan/[id]
    if (route.includes("[id]")) {
      const baseRoute = route.replace("/[id]", "");
      return pathname.startsWith(baseRoute + "/") || pathname === baseRoute;
    }
    return pathname === route;
  });
}


function createRedirectResponse(
  targetUrl: string, 
  currentUrl: string, 
  isExpired: boolean = false
): NextResponse {
  const response = NextResponse.redirect(new URL(targetUrl, currentUrl));
  
  response.cookies.set(CookieType.CurrentUrl, currentUrl);
  response.cookies.set(
    CookieType.ExpiryMessage,
    isExpired 
      ? "Session expired. Please login again."
      : "Please login to continue."
  );
  
  return response;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token;

  const { pathname } = req.nextUrl;
  const currentUrl = req.url;
  
  const isAuthPage = pathname === ALLOWED_ROUTES.LOGIN;
  const tokenExpired = isTokenExpired(token);
  const isAuthenticated = !!token && !tokenExpired;
  const userRole = token?.role as UserRole;

  // Handle authenticated users on login page
  if (isAuthPage && isAuthenticated && userRole) {
    const defaultRoute = ROLE_PERMISSIONS[userRole].defaultRoute;
    return NextResponse.redirect(new URL(defaultRoute, currentUrl));
  }

  // Handle unauthenticated users
  if (!isAuthenticated && !isAuthPage) {
    return createRedirectResponse(ALLOWED_ROUTES.LOGIN, currentUrl, tokenExpired);
  }

  // Handle authenticated users accessing protected routes
  if (isAuthenticated && !isAuthPage && userRole) {
    if (!hasRoutePermission(userRole, pathname)) {
      const defaultRoute = ROLE_PERMISSIONS[userRole].defaultRoute;
      return NextResponse.redirect(new URL(defaultRoute, currentUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for:
     * - /api (API routes)
     * - /_next/static (static files)
     * - /_next/image (Next.js image optimization)
     * - /favicon.ico (favicon)
     * - /.well-known (well-known URIs)
     * - Files with extensions (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|\\.well-known|.*\\..*).*)",
  ],
};