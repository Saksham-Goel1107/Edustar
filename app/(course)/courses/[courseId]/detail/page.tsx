'use client';

import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import Image from "next/image"
import FeedbackItem from './_components/feedback-item';
import FeedbackForm from './_components/feedback-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Feedback as Feedback } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import CourseEnrollButton from '../chapters/[chapterId]/_components/course-enroll-button';

const CourseDetailPage = ({ params }: { params: { courseId: string } }) => {
	const { courseId } = params;
	const router = useRouter();
	const searchParams = useSearchParams();
	const success = searchParams.get('success');
	const canceled = searchParams.get('canceled');

	const { userId } = useAuth();

	const [course, setCourse] = useState<any>(null);
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isFeedbacked, setIsFeedbacked] = useState(false);
	const [isPurchased, setIsPurchased] = useState(false);

	useEffect(() => {
		if (success === '1') {
			toast.success("Course purchased successfully! You now have full access.");
			
			const url = new URL(window.location.href);
			url.searchParams.delete('success');
			window.history.replaceState({}, '', url);
			
			if (userId && courseId) {
				const verifyPurchase = async () => {
					try {

						let attempts = 0;
						const maxAttempts = 3;
						
						const checkPurchaseStatus = async () => {
							attempts++;
							try {
								const res = await axios.get(`/api/courses/${courseId}`);
								const courseData = res.data;
								
								if (courseData.purchases && courseData.purchases.some((purchase: any) => purchase.userId === userId)) {
									setIsPurchased(true);
									setCourse(courseData);
									return true;
								}
								return false;
							} catch (error) {
								console.log(`Purchase check attempt ${attempts} failed:`, error);
								return false;
							}
						};
						
						const initialCheck = await checkPurchaseStatus();
						if (!initialCheck && attempts < maxAttempts) {
							try {
								await axios.post(`/api/courses/${courseId}/purchase`);
								setIsPurchased(true);
								const res = await axios.get(`/api/courses/${courseId}`);
								setCourse(res.data);
							} catch (purchaseError: any) {
								if (purchaseError.response?.data === "Already purchased") {
									setIsPurchased(true);
									console.log("Course was already purchased");
								} else {
									console.log("Fallback purchase failed:", purchaseError);
									setTimeout(async () => {
										const secondCheck = await checkPurchaseStatus();
										if (!secondCheck && attempts < maxAttempts) {
											setTimeout(async () => {
												await checkPurchaseStatus();
											}, 3000); 
										}
									}, 1000); 
								}
							}
						}
					} catch (error) {
						console.log("Error verifying purchase:", error);
					}
				};
				
				verifyPurchase();
			}
		}

		if (canceled === '1') {
			toast.error("Purchase was canceled.");

			const url = new URL(window.location.href);
			url.searchParams.delete('canceled');
			window.history.replaceState({}, '', url);
		}
	}, [success, canceled, userId, courseId]);

	useEffect(() => {
		if (!userId || !courseId) return;

		const checkPurchase = async () => {
			try {
				const verifyRes = await axios.get(`/api/courses/${courseId}/verify-purchase`);
				if (verifyRes.data.purchased) {
					setIsPurchased(true);
				}
				
				const courseRes = await axios.get(`/api/courses/${courseId}`);
				const courseData = courseRes.data;
				
				if (courseData.purchases && courseData.purchases.some((purchase: any) => purchase.userId === userId)) {
					setIsPurchased(true);
				}

				setCourse(courseData);
				
				console.log("Purchase status:", { 
					isPurchased: verifyRes.data.purchased,
					courseHasPurchases: Boolean(courseData.purchases?.length),
					purchases: courseData.purchases
				});
			} catch (error) {
				console.log("Error checking purchase:", error);
			}
		};

		checkPurchase();
	}, [courseId, userId]);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/courses/${courseId}/feedbacks`);

				setFeedbacks(res.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [courseId]);

	useEffect(() => {
		if (!feedbacks.length || !userId) return;

		feedbacks.forEach((feedback) => {
			if (feedback.userId === userId) {
				setIsFeedbacked(true);
			}
		});
	}, [feedbacks, userId]);

	const afterSentFeedback = (newFeedback: Feedback) => {
		setFeedbacks((prev) => [...prev, newFeedback]);
		setIsFeedbacked(true);
	};

	const navigateToFirstChapter = () => {
		if (course?.chapters && course.chapters.length > 0) {
			router.push(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
		}
	};

	return (
		<div className="p-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 center-content">
				<div>
					<div className="px-[15px] py-[12px] text-3xl font-bold">
						{course?.title}
					</div>

					<div
						className={cn(
							'text-sm mt-2',
							!course?.description && 'text-slate-500 italic'
						)}
					>
						{!course?.description && 'No description'}

						{course?.description && <Preview value={course?.description} />}
					</div>

					<div className="px-4">
						{isPurchased ? (
							<>
								<div className="bg-green-100 dark:bg-green-900 p-3 mb-4 rounded-md text-green-800 dark:text-green-200">
									<p className="text-sm font-semibold">✓ You own this course</p>
								</div>
								<Button onClick={navigateToFirstChapter} className="mt-2 w-full">
									Continue Studying
								</Button>
							</>
						) : course?.price ? (
							<>
								<div className="bg-yellow-100 dark:bg-yellow-900 p-3 mb-4 rounded-md text-yellow-800 dark:text-yellow-200">
									<p className="text-sm font-medium">Purchase this course to get full access</p>
								</div>
								<CourseEnrollButton
									courseId={courseId}
									price={course.price || 0}
								/>
								<Button 
									variant="outline" 
									onClick={() => window.location.reload()} 
									className="mt-2 w-full"
								>
									Refresh Course Data
								</Button>
							</>
						) : null}
					</div>
				</div>

				<div>
					{course?.imageUrl && (
						<div className="w-full h-[350px] relative">
							<Image
								className="rounded-md shadow-md object-cover "
								src={course.imageUrl}
								alt="course-image"
								fill
							/>
						</div>
					)}

					<div className="flex mt-6 items-center">
						<div className="flex items-center text-orange-400 font-bold text-xl">
							{`4/5`}
							<Star className="w-4 h-4 ml-1 fill-current" />
						</div>

						<div className="ml-3 text-sm text-slate-500">{`(${feedbacks.length} people review)`}</div>
					</div>
				</div>
			</div>

			<div className="mt-12 pl-4">
				<div className="text-2xl font-bold mt-8 mb-4">Feedbacks</div>

				<div className="grid grid-cols-1 gap-y-3">
					{feedbacks.map((feedback, index) => (
						<FeedbackItem
							key={feedback.id}
							content={feedback.content}
							fullName={feedback.fullName}
							imageUrl={feedback.avatarUrl}
							rating={5}
							duration={index + 1}
						/>
					))}
				</div>

				{course && !isFeedbacked && isPurchased && (
					<FeedbackForm
						courseId={course.id}
						afterSentFeedback={afterSentFeedback}
					/>
				)}
			</div>
		</div>
	);
};

export default CourseDetailPage;
