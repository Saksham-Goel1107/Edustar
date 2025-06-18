import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const isTeacher = (userId?: string | null) => {
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};

export default authMiddleware({
  publicRoutes: [
    '/api/webhook',
    '/sign-in',
    '/sign-in/(.*)',
    '/sign-up',
    '/sign-up/(.*)',
    '/_clerk/(.*)',
    '/favicon.ico',
  ],
  afterAuth(auth, req) {
    const path = req.nextUrl.pathname;
    
    if (!auth.userId && !auth.isPublicRoute) {

      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    if (auth.userId && isTeacher(auth.userId)) {
      const isAllowedRoute = 
        path.startsWith('/teacher') || 
        path.startsWith('/api') || 
        path.startsWith('/_next') || 
        path.startsWith('/favicon.ico');
        
      if (path === '/') {
        const redirectUrl = new URL('/teacher/courses', req.url);
        return NextResponse.redirect(redirectUrl);
      }

      if (!isAllowedRoute) {
        const redirectUrl = new URL('/teacher/courses', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
};
