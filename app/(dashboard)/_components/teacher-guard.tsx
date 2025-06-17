'use client';

import { isTeacher } from "@/lib/teacher";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const TeacherGuard = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();  useEffect(() => {
    // If user is a teacher
    if (isTeacher(userId)) {
      // Root path should redirect to teacher dashboard
      if (pathname === '/') {
        console.log("Redirecting teacher from root to teacher dashboard");
        router.push('/teacher/courses');
        return;
      }
      
      // Check if the current pathname is allowed - only teacher routes
      const isAllowedRoute = pathname?.startsWith('/teacher') || 
                            pathname?.startsWith('/api') || 
                            pathname?.startsWith('/_next') || 
                            pathname?.startsWith('/favicon.ico');
      
      // If not in allowed routes, redirect to teacher courses
      if (!isAllowedRoute) {
        console.log("Redirecting teacher to teacher dashboard from:", pathname);
        router.push('/teacher/courses');
      }
    }
  }, [userId, pathname, router]);

  return null;
};
