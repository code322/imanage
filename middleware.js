import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import getConfig from 'next/config';
import { jwtVerify } from 'jose';
export const config = {
  matcher: ['/edit', '/api/employees/delete/:path*'],
};

export default async function middleware(req) {
  const { cookies, method } = req;
  const access_token = process.env.access_token;

  const jwt = cookies.get('token');
  const url = req.nextUrl.clone();

  if (
    req.nextUrl.pathname.includes('/edit') ||
    req.nextUrl.pathname.includes('/api/employees/delete/')
  ) {
    url.pathname = '/login';

    if (!jwt) {
      return NextResponse.redirect(url);
    }
    try {
      const { payload } = await jwtVerify(
        jwt,
        new TextEncoder().encode(access_token)
      );

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
