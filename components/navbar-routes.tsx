'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import SearchInput from './search-input';
import { isTeacher } from '@/lib/teacher';
import { ModeToggle } from './mode-toggle';
import { LogOut } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const NavbarRoutes = () => {
	const { userId } = useAuth();
	const pathname = usePathname();

	const isTeacherUser = isTeacher(userId);
	const isSearchPage = pathname?.startsWith('/search');

	// Determine where the exit button should go based on user role
	const exitHref = isTeacherUser ? '/teacher/courses' : '/';

	return (
		<>
			{isSearchPage && !isTeacherUser && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}

			<div className="flex gap-x-2 ml-auto">
				<div className="pr-6">
					<ModeToggle />
				</div>

				<Link href={exitHref}>
					<Button size={'sm'} variant={'ghost'}>
						<LogOut className="h-4 w-4 mr-2" />
						{isTeacherUser ? 'Dashboard' : 'Exit'}
					</Button>
				</Link>

				<UserButton afterSignOutUrl="/" />
			</div>
		</>
	);
};

export default NavbarRoutes;
