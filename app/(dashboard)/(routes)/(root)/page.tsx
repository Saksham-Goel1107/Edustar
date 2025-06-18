'use client';

import CoursesList from '@/components/courses-list';
import { CheckCircle, Clock, LayoutDashboard } from 'lucide-react';
import InfoCard from './_components/info-card';
import { useEffect, useState } from 'react';
import { Category, Chapter, Course, CourseStatistic } from '@prisma/client';
import axios from 'axios';
import { STORAGE_KEY } from '@/constants/storage';
import { DASHBOARD_ITEM_ID } from '@/constants/dashboard-item-id';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { isTeacher } from '@/lib/teacher';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { RecommendCourse } from '@/types';
import RecommendedCourses from '@/components/recommended-courses';

type CourseWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

const Dashboard = () => {
	const { userId } = useAuth();

	if (isTeacher(userId)) redirect('/teacher/courses');

	const [dashboardSetting, setDashboardSetting] = useState<string[]>();
	const [completedCourses, setCompletedCourses] =
		useState<CourseWithProgressWithCategory[]>();
	const [coursesInProgress, setCoursesInProgress] =
		useState<CourseWithProgressWithCategory[]>();
	const [recommendedCourses, setRecommendedCourses] =
		useState<RecommendCourse[]>();

	// Track if the component is mounted to prevent memory leaks and SSR issues
	const [isMounted, setIsMounted] = useState(false);

	// Load initial data from localStorage only on client side
	useEffect(() => {
		setIsMounted(true);

		// Safe access to localStorage (only works in browser)
		try {
			setCompletedCourses(
				JSON.parse(localStorage.getItem(STORAGE_KEY.completedCourses) || '[]')
			);

			setCoursesInProgress(
				JSON.parse(localStorage.getItem(STORAGE_KEY.coursesInProgress) || '[]')
			);

			setDashboardSetting(
				JSON.parse(localStorage.getItem(STORAGE_KEY.dashboardSetting) || '[]')
			);

			setRecommendedCourses(
				JSON.parse(localStorage.getItem(STORAGE_KEY.recommendedCourse) || '[]')
			);
		} catch (error) {
			console.error("Error loading data from localStorage:", error);
		}
	}, []);

	// Fetch courses data from the API
	useEffect(() => {
		// Only fetch if the component is mounted
		if (!isMounted) return;
		
		const fetchCourses = async () => {
			try {
				const res = await axios.get(`/api/courses/dashboard`);

				setCompletedCourses(res.data.completedCourses);
				setCoursesInProgress(res.data.coursesInProgress);

				// Safely store data in localStorage
				try {
					localStorage.setItem(
						STORAGE_KEY.completedCourses,
						JSON.stringify(res.data.completedCourses)
					);
					localStorage.setItem(
						STORAGE_KEY.coursesInProgress,
						JSON.stringify(res.data.coursesInProgress)
					);
				} catch (storageError) {
					console.error("Error storing data in localStorage:", storageError);
				}
			} catch (error) {
				console.error("Error fetching dashboard courses:", error);
			}
		};
		
		fetchCourses();
	}, [isMounted]);

	// Fetch recommended courses from the API
	useEffect(() => {
		// Only fetch if the component is mounted
		if (!isMounted) return;
		
		const fetchRecommendedCourses = async () => {
			try {
				const res = await axios.get(`/api/courses/recommend`);

				setRecommendedCourses(res.data);

				// Safely store data in localStorage
				try {
					localStorage.setItem(
						STORAGE_KEY.recommendedCourse,
						JSON.stringify(res.data)
					);
				} catch (storageError) {
					console.error("Error storing recommended courses in localStorage:", storageError);
				}
			} catch (error) {
				console.error("Error fetching recommended courses:", error);
			}
		};
		
		fetchRecommendedCourses();
	}, [isMounted]);

	// Fetch personalization settings
	useEffect(() => {
		// Only fetch if the component is mounted
		if (!isMounted) return;
		
		const fetchPersonalization = async () => {
			try {
				const res = await axios.get(`/api/personalization`);

				if (res?.data?.dashboard) {
					try {
						const parsedDashboardSetting = JSON.parse(res.data.dashboard);
						setDashboardSetting(parsedDashboardSetting);

						// Safely store data in localStorage
						try {
							localStorage.setItem(
								STORAGE_KEY.dashboardSetting,
								res.data.dashboard
							);
						} catch (storageError) {
							console.error("Error storing dashboard settings in localStorage:", storageError);
						}
					} catch (parseError) {
						console.error("Error parsing dashboard settings:", parseError);
					}
				}
			} catch (error) {
				console.error("Error fetching personalization settings:", error);
			}
		};
		
		fetchPersonalization();
	}, [isMounted]);

	// Show a loading state while waiting for client-side initialization
	if (!isMounted) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[50vh]">
				<div className="text-center">
					<p className="text-lg text-slate-600 dark:text-slate-400">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-4">
			<div
				className={cn(
					'grid grid-cols-1 sm:grid-cols-2 gap-4',
					dashboardSetting?.length === 1 && 'sm:grid-cols-1'
				)}
			>
				{((dashboardSetting &&
						dashboardSetting?.includes(DASHBOARD_ITEM_ID.inProgress)) ||
						!dashboardSetting) && (
						<div>
							<InfoCard
								icon={Clock}
								label="In Progress"
								numberOfItems={coursesInProgress?.length || 0}
							/>

							{coursesInProgress && coursesInProgress.length > 0 ? (
								<CoursesList
									size={dashboardSetting?.length === 1 ? 'sm' : 'lg'}
									items={coursesInProgress}
								/>
							) : (
								<div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-lg mt-2">
									<p className="text-slate-600 dark:text-slate-400">
										You don&apos;t have any courses in progress yet
									</p>
								</div>
							)}
						</div>
					)}

				{((dashboardSetting &&
						dashboardSetting?.includes(DASHBOARD_ITEM_ID.completed)) ||
						!dashboardSetting) && (
						<div>
							<InfoCard
								icon={CheckCircle}
								label="Completed"
								variant="success"
								numberOfItems={completedCourses?.length || 0}
							/>

							{completedCourses && completedCourses.length > 0 ? (
								<CoursesList
									size={dashboardSetting?.length === 1 ? 'sm' : 'lg'}
									items={completedCourses}
								/>
							) : (
								<div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-lg mt-2">
									<p className="text-slate-600 dark:text-slate-400">
										You haven&apos;t completed any courses yet
									</p>
								</div>
							)}
						</div>
					)}
			</div>

			<div className="pt-10 !mt-10 border-t-2 border-gray-200 dark:border-gray-700">
				<div className="pb-6 flex items-center gap-x-2">
					<IconBadge icon={LayoutDashboard} />

					<h2 className="text-xl">Recommended for you</h2>
				</div>

				{recommendedCourses && recommendedCourses.length > 0 ? (
					<RecommendedCourses items={recommendedCourses} />
				) : (
					<div className="text-center py-10 bg-slate-100 dark:bg-slate-800 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">No recommended courses yet</h3>
						<p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
							Browse our course catalog to discover exciting learning opportunities and kickstart your educational journey.
						</p>
						<a href="/search" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
							Browse Courses
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
