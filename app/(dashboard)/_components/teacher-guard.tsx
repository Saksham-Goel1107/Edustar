'use client';

import { isTeacher } from "@/lib/teacher";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const TeacherGuard = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();  useEffect(() => {
    if (isTeacher(userId)) {
      if (pathname === '/') {
        router.push('/teacher/courses');
        return;
      }
      
      const isAllowedRoute = pathname?.startsWith('/teacher') || 
                            pathname?.startsWith('/api') || 
                            pathname?.startsWith('/_next') || 
                            pathname?.startsWith('/favicon.ico');
      
      if (!isAllowedRoute) {
        router.push('/teacher/courses');
      }
    }
  }, [userId, pathname, router]);

  return null;
};
