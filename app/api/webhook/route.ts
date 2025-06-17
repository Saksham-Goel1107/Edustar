import Stripe from 'stripe';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
	console.log('[STRIPE WEBHOOK] Received webhook request');
	const body = await req.text();

	const signature = headers().get('Stripe-Signature') as string;
	
	if (!signature) {
		console.log('[STRIPE WEBHOOK ERROR] No signature found in headers');
		return new NextResponse('No Stripe signature found', { status: 400 });
	}
	
	if (!process.env.STRIPE_WEBHOOK_SECRET) {
		console.log('[STRIPE WEBHOOK ERROR] Missing STRIPE_WEBHOOK_SECRET environment variable');
		return new NextResponse('Server configuration error', { status: 500 });
	}

	let event: Stripe.Event;

	try {
		console.log('[STRIPE WEBHOOK] Verifying signature with secret');
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
		console.log('[STRIPE WEBHOOK] Signature verified successfully');
	} catch (error: any) {
		console.log('[STRIPE WEBHOOK ERROR]', error.message);
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	const session = event.data.object as Stripe.Checkout.Session;
	const userId = session?.metadata?.userId;
	const courseId = session?.metadata?.courseId;

	if (event.type === 'checkout.session.completed') {
		console.log(`[STRIPE SUCCESS] Processing purchase for user: ${userId}, course: ${courseId}`);
		
		if (!userId || !courseId) {
			console.log('[STRIPE WEBHOOK ERROR] Missing userId or courseId in metadata');
			return new NextResponse('Missing required metadata', { status: 400 });
		}
		try {
			
			const existingPurchase = await db.purchase.findUnique({
				where: {
					userId_courseId: {
						userId,
						courseId,
					}
				}
			});

			if (existingPurchase) {
				console.log(`[STRIPE WEBHOOK] Purchase already exists for user: ${userId}, course: ${courseId}`);
				return new NextResponse('Purchase already exists', { status: 200 });
			}

			const purchase = await db.purchase.create({
				data: {
					courseId,
					userId,
				},
			});
			console.log(`[STRIPE WEBHOOK] Created purchase: ${purchase.id} for user: ${userId}, course: ${courseId}`);
		} catch (error) {
			console.log('[STRIPE WEBHOOK ERROR] Failed to create purchase record:', error);
			return new NextResponse('Failed to create purchase record', { status: 500 });
		}

		try {
			const course = await db.course.findUnique({
				where: {
					id: courseId,
				},
				select: {
					category: true,
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
				console.log(`[STRIPE WEBHOOK] Updated course statistics for course: ${courseId}`);
			}
		} catch (error) {
			console.log('[STRIPE WEBHOOK ERROR] Failed to update course statistics:', error);
		}
	} else if (event.type === 'checkout.session.expired') {
		console.log(`[STRIPE WEBHOOK] Checkout session expired for user: ${userId}, course: ${courseId}`);
	} else {
		console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
		return new NextResponse(
			`Webhook received but unhandled event type: ${event.type}`,
			{ status: 200 }
		);
	}

	return new NextResponse('Webhook processed successfully', { status: 200 });
}
