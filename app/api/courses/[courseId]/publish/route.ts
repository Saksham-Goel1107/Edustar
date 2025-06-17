import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();

		const { courseId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const course = await db.course.findUnique({
			where: { id: courseId, userId },
			include: {
				chapters: {
					include: {
						muxData: true,
					},
				},
				attachments: true, // Include attachments
			},
		});

		if (!course) {
			return new NextResponse('Not Found', { status: 404 });
		}

		const hasPublishedChapter = course.chapters.some(
			(chapter) => chapter.isPublished
		);

		const missingFields = [];
		
		if (!course.title) missingFields.push('title');
		if (!course.description) missingFields.push('description');
		if (!course.imageUrl) missingFields.push('image');
		if (!course.categoryId) missingFields.push('category');
		if (!course.price) missingFields.push('price');
		if (course.attachments.length === 0) missingFields.push('attachments');
		if (!hasPublishedChapter) missingFields.push('published chapter');
		
		if (missingFields.length > 0) {
			return new NextResponse(`Missing required fields: ${missingFields.join(', ')}`, { status: 401 });
		}

		const publishedCourse = await db.course.update({
			where: { id: courseId, userId },
			data: { isPublished: true },
		});

		return NextResponse.json(publishedCourse);
	} catch (error) {
		console.log('[ERROR] PATCH /api/courses/[courseId]/publish', error);

		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
