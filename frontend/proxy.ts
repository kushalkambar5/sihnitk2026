import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || 'docprint-sih-secret-key-2026';
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  const isAuth = !!token;
  const userRole = token?.role as string | undefined;

  // 1. Redirect authenticated users away from /login & /register to their role dashboard
  if (isAuth && (pathname === '/login' || pathname === '/register')) {
    if (userRole === 'SHOP_OWNER' || userRole === 'SHOP_STAFF') {
      return NextResponse.redirect(new URL('/shop/dashboard', req.url));
    }
    if (userRole === 'DELIVERY_PARTNER') {
      return NextResponse.redirect(new URL('/delivery/jobs', req.url));
    }
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Guard Protected Routes
  const isShopRoute = pathname.startsWith('/shop');
  const isDeliveryRoute = pathname.startsWith('/delivery');
  const isAdminRoute = pathname.startsWith('/admin');
  const isCustomerRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/orders');

  if (isShopRoute || isDeliveryRoute || isAdminRoute || isCustomerRoute) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access protection
    if (isShopRoute && userRole !== 'SHOP_OWNER' && userRole !== 'SHOP_STAFF') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (isDeliveryRoute && userRole !== 'DELIVERY_PARTNER') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/shop/:path*',
    '/delivery/:path*',
    '/admin/:path*',
    '/orders/:path*',
    '/login',
    '/register',
  ],
};
