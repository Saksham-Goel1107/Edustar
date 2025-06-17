import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();

		const { courseId, chapterId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const ownCourse = db.course.findUnique({
			where: { id: courseId, userId },
		});

		if (!ownCourse) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const chapter = await db.chapter.findUnique({
			where: { id: chapterId, courseId },
		});

		const muxData = await db.muxData.findFirst({
			where: {
				chapterId,
			},
		});

		if (!chapter) {
			return new NextResponse('Chapter not found', { status: 404 });
		}
		
		const missingFields = [];
		
		if (!chapter.title) missingFields.push('title');
		if (!chapter.description) missingFields.push('description');
		if (!chapter.videoUrl) missingFields.push('video');
		if (!muxData) missingFields.push('video processing');
		
		if (missingFields.length > 0) {
			return new NextResponse(`Missing required fields: ${missingFields.join(', ')}`, { status: 400 });
		}

		const publishedChapter = await db.chapter.update({
			where: { id: chapterId, courseId },
			data: { isPublished: true },
		});

		return NextResponse.json(publishedChapter);
	} catch (error) {
		console.log(
			'[ERROR] PATCH /api/courses/[courseId]/chapters/[chapterId]/publish',
			error
		);

		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
