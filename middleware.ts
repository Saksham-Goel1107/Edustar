import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isTeacher = (userId?: string | null) => {
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ['/api/webhook', '/test-page', '/', '/api/courses/recommend'],
  afterAuth(auth, req) {
    // If user is logged in as a teacher
    if (auth.userId && isTeacher(auth.userId)) {
      const path = req.nextUrl.pathname;

      // Define allowed routes for teachers - only teacher routes
      const isAllowedRoute = 
        path.startsWith('/teacher') || 
        path.startsWith('/api') || 
        path.startsWith('/_next') || 
        path.startsWith('/favicon.ico');
        
      // For root path, redirect to teacher dashboard
      if (path === '/') {
        const redirectUrl = new URL('/teacher/courses', req.url);
        return NextResponse.redirect(redirectUrl);
      }

      // If teacher tries to access a non-allowed route
      if (!isAllowedRoute) {
        const redirectUrl = new URL('/teacher/courses', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next();
  }
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
