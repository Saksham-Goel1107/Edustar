'use client';

import { db } from '@/lib/db';
import { Chapter, Course, UserProgress, Purchase } from '@prisma/client';
import CourseSidebarItem from './course-sidebar-item';
import CourseProgress from '@/components/course-progress';
import CourseSidebarItem2 from './course-sidebar-item-2';
import CourseSidebarItem3 from './course-sidebar-item-3';

interface CourseSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgresses: UserProgress[] | null;
		})[];
	};
	progressCount: number;
	purchase: Purchase | null;
}

const CourseSidebar = ({ course, progressCount, purchase }: CourseSidebarProps) => {

	return (
		<div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:border-r-slate-700">
			<div className="p-8 flex flex-col border-b dark:border-b-slate-700">
				<h1 className="font-semibold dark:text-white">{course.title}</h1>

				{purchase && (
					<div className="mt-10">
						<CourseProgress variant="success" value={progressCount} />
					</div>
				)}
			</div>

			<div className="flex flex-col w-full">
				<CourseSidebarItem3 courseId={course.id} label="Course Information" />

				{course.chapters.map((chapter) => (
					<CourseSidebarItem
						key={chapter.id}
						id={chapter.id}
						label={chapter.title}
						isCompleted={!!chapter.userProgresses?.[0]?.isCompleted}
						courseId={course.id}
						isLocked={!chapter.isFree && !purchase}
					/>
				))}

				<CourseSidebarItem2 courseId={course.id} label="Final Exam" />
			</div>
		</div>
	);
};

export default CourseSidebar;
