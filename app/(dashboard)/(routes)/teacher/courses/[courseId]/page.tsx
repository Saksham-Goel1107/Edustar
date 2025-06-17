import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import {
	CircleDollarSign,
	File,
	LayoutDashboard,
	ListChecks,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentForm from './_components/attachment-form';
import ChaptersForm from './_components/chapters-form';
import Banner from '@/components/banner';
import Actions from './_components/actions';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	const goToHomePage = () => {
		redirect('/');
	};

	if (!userId) {
		return goToHomePage();
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
			userId,
		},
		include: {
			chapters: { orderBy: { position: 'asc' } },
			attachments: { orderBy: { createdAt: 'desc' } },
		},
	});

	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	});

	if (!course) {
		return goToHomePage();
	}

	// Define the required fields and their status
	const requiredFieldsStatus = {
		title: !!course.title,
		description: !!course.description,
		imageUrl: !!course.imageUrl,
		price: !!course.price,
		categoryId: !!course.categoryId,
		attachments: course.attachments.length > 0,
		publishedChapter: course.chapters.some((chapter) => chapter.isPublished),
	};

	// Convert to array for counting
	const requiredFields = Object.values(requiredFieldsStatus);
	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	
	// Find missing fields for detailed feedback
	const missingFieldsLabels = Object.entries(requiredFieldsStatus)
		.filter(([_, isComplete]) => !isComplete)
		.map(([field]) => {
			switch(field) {
				case 'title': return 'Title';
				case 'description': return 'Description';
				case 'imageUrl': return 'Image';
				case 'price': return 'Price';
				case 'categoryId': return 'Category';
				case 'attachments': return 'Attachments';
				case 'publishedChapter': return 'Published Chapter';
				default: return field;
			}
		});

	const completionText = `${completedFields} of ${totalFields} fields completed`;

	const isComplete = Object.values(requiredFieldsStatus).every(Boolean);

	return (
		<>
			{!course.isPublished && (
				<Banner label="This course is unpublished. It will not be visible to the learner." />
			)}

			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-medium">Course setup</h1>

						<span className="text-sm text-slate-700">{completionText}</span>
						
						{missingFieldsLabels.length > 0 && (
							<div className="text-xs text-rose-500 mt-1">
								Missing: {missingFieldsLabels.join(", ")}
							</div>
						)}
					</div>

					<Actions
						disabled={!isComplete}
						courseId={params.courseId}
						isPublished={course.isPublished}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} />

							<h2 className="text-xl">Customize your course</h2>
						</div>

						<TitleForm initialData={course} courseId={course.id} />

						<DescriptionForm initialData={course} courseId={course.id} />

						<ImageForm initialData={course} courseId={course.id} />

						<CategoryForm
							initialData={course}
							courseId={course.id}
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
						/>
					</div>

					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={ListChecks} />

								<h2 className="text-xl">Course chapters</h2>
							</div>

							<ChaptersForm initialData={course} courseId={course.id} />
						</div>

						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={CircleDollarSign} />

								<h2 className="text-xl">Sell your course</h2>
							</div>

							<PriceForm initialData={course} courseId={course.id} />
						</div>

						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={File} />

								<h2 className="text-xl">Resources & Attachments</h2>
							</div>

							<AttachmentForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CourseIdPage;
