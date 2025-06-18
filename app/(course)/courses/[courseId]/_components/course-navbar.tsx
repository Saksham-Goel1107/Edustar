"use client";

import NavbarRoutes from '@/components/navbar-routes';
import { Chapter, Course, UserProgress, Purchase } from '@prisma/client';
import CourseMobileSidebar from './course-mobile-sidebar';

interface CourseNavbarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgresses: UserProgress[] | null;
		})[];
	};
	progressCount: number;
	purchase?: Purchase | null;
}

const CourseNavbar = ({ course, progressCount, purchase }: CourseNavbarProps) => {
	return (
		<div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
			<CourseMobileSidebar course={course} progressCount={progressCount} purchase={purchase ?? null} />

			<NavbarRoutes />
		</div>
	);
};

export default CourseNavbar;
