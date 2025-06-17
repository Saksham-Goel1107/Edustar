import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;


        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Check if the course exists
        const course = await db.course.findUnique({
            where: { id: courseId, isPublished: true },
            include: {
                category: true,
            },
        });

        if (!course) {
            console.log(`[ERROR] Course not found: ${courseId}`);
            return new NextResponse('Course not found', { status: 404 });
        }

        // Check if already purchased
        const existingPurchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingPurchase) {
            return new NextResponse('Already purchased', { status: 400 });
        }

        const purchase = await db.purchase.create({
            data: {
                courseId,
                userId,
            },
        });

        const courseStatistic = await db.courseStatistic.findUnique({
            where: {
                courseId,
            },
        });

        if (course?.category) {
            if (courseStatistic) {
                await db.courseStatistic.update({
                    where: {
                        courseId,
                    },
                    data: {
                        purchases: courseStatistic.purchases + 1,
                    },
                });
            } else {
                await db.courseStatistic.create({
                    data: {
                        courseId,
                        purchases: 1,
                        views: 0,
                        categoryId: course.category.id,
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            purchase: purchase,
            message: 'Course purchased successfully'
        });
    } catch (error) {
        console.log('[ERROR] POST /api/courses/[courseId]/purchase', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
