"use client";

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Chapter, Course, UserProgress, Purchase } from '@prisma/client';
import { Menu } from 'lucide-react';
import CourseSidebar from './course-sidebar';
import {useTheme} from "next-themes"

interface CourseMobileSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgresses: UserProgress[] | null;
		})[];
	};
	progressCount: number;
	purchase: Purchase | null;
}

const CourseMobileSidebar = ({
	course,
	progressCount,
	purchase,
}: CourseMobileSidebarProps) => {
	const {resolvedTheme} = useTheme()
	return (
		<Sheet>
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<Menu />
			</SheetTrigger>

			<SheetContent side={'left'} className={`p-0 ${resolvedTheme === "dark"?"bg-slate-800":"bg-white"} w-72`}>
				<CourseSidebar course={course} progressCount={progressCount} purchase={purchase} />
			</SheetContent>
		</Sheet>
	);
};

export default CourseMobileSidebar;
