import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        return NextResponse.json({
            purchased: !!purchase,
            purchaseDate: purchase?.createdAt || null
        });
    } catch (error) {
        console.log('[ERROR] GET /api/courses/[courseId]/verify-purchase', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
