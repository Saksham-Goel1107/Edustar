// use client to avoid SSR error
'use client';

import {
	ActivitySquare,
	BarChart,
	Compass,
	Heart,
	Layout,
	List,
	Phone,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const learnerRoutes = [
	{
		icon: Layout,
		label: 'Dashboard',
		href: '/',
	},
	{
		icon: Compass,
		label: 'Browse',
		href: '/search',
	},
	{
		icon: ActivitySquare,
		label: 'Customization',
		href: '/personalization',
	},
	{
		icon: Phone,
		label: 'Video Call',
		href: '/channel',
	},
];

const teacherRoutes = [
	{
		icon: List,
		label: 'Courses',
		href: '/teacher/courses',
	},
	{
		icon: BarChart,
		label: 'Analytics',
		href: '/teacher/analytics',
	},
	{
		icon: Phone,
		label: 'Video Call',
		href: '/teacher/channel', // Teacher-specific route to the same shared channel
	},
];

const SidebarRoutes = () => {
	const pathname = usePathname();

	const isTeacherPage = pathname?.startsWith('/teacher');

	const routes = isTeacherPage ? teacherRoutes : learnerRoutes;

	return (
		<div className="flex flex-col w-full">
			{routes.map((route) => {
				return (
					<SidebarItem
						key={route.href}
						icon={route.icon}
						label={route.label}
						href={route.href}
					/>
				);
			})}
		</div>
	);
};

export default SidebarRoutes;
