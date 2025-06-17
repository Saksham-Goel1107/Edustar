'use client';

import { cn } from '@/lib/utils';
import { Book } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface CourseSidebarItem3Props {
	label?: string;
	isCompleted?: boolean;
	courseId?: string;
}

const CourseSidebarItem3 = ({
	label,
	isCompleted,
	courseId,
}: CourseSidebarItem3Props) => {
	const pathname = usePathname();
	const router = useRouter();

	const isActive = pathname?.includes(`/courses/${courseId}/detail`);

	const onClick = () => {
		router.push(`/courses/${courseId}/detail`);
	};

	const { resolvedTheme } = useTheme();

	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				"flex items-center gap-x-2 text-sm font-[500] pl-6 transition-all",
				resolvedTheme === 'dark' 
					? "text-white hover:text-white hover:bg-slate-700/50" 
					: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/20",
				isActive && resolvedTheme === 'dark'
					? "bg-slate-700/50 text-white" 
					: isActive && "bg-slate-200/20 text-slate-700",
				isCompleted && resolvedTheme === 'dark'
					? "text-emerald-300 hover:text-emerald-200" 
					: isCompleted && "text-emerald-700 hover:text-emerald-700",
				isCompleted && isActive && resolvedTheme === 'dark'
					? "bg-emerald-800/30" 
					: isCompleted && isActive && "bg-emerald-200/20"
			)}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Book
					size={22}
					className={cn(
						resolvedTheme === 'dark' ? 'text-white' : 'text-slate-500',
						isActive && resolvedTheme === 'dark' ? 'text-white' : isActive && 'text-slate-700',
						isCompleted && resolvedTheme === 'dark' ? 'text-emerald-300' : isCompleted && 'text-emerald-700'
					)}
				/>

				<p className="text-left">{label}</p>
			</div>

			<div
				className={cn(
					'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
					isActive && 'opacity-100',
					isCompleted && 'border-emerald-700'
				)}
			/>
		</button>
	);
};

export default CourseSidebarItem3;
