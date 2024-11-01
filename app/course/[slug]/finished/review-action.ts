'use server';

import { db } from '@/db/db';
import { CourseEnrollments, Courses, CoursesReviews } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createReview(
	courseId: number,
	review: {
		stars: number;
		review?: string;
	}
) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		const [enrollment] = await db
			.select({
				slug: Courses.slug
			})
			.from(CourseEnrollments)
			.leftJoin(Courses, eq(Courses.course_id, CourseEnrollments.course_id))
			.where(
				and(
					eq(CourseEnrollments.course_id, courseId),
					eq(CourseEnrollments.user_id, session.data.id),
					eq(CourseEnrollments.completed, true)
				)
			);
		if (!enrollment) {
			throw new Error('Course not found');
		}

		const [checkReview] = await db
			.select()
			.from(CoursesReviews)
			.where(
				and(
					eq(CoursesReviews.course_id, courseId),
					eq(CoursesReviews.user_id, session.data.id)
				)
			);
		if (checkReview) {
			const [reviewReturn] = await db
				.update(CoursesReviews)
				.set({
					rating: review.stars,
					comment: review.review
				})
				.where(
					and(
						eq(CoursesReviews.course_id, courseId),
						eq(CoursesReviews.user_id, session.data.id)
					)
				)
				.returning();
			revalidatePath(`/course/${enrollment.slug}`);
			return {
				success: true as const,
				data: reviewReturn
			};
		} else {
			const [reviewReturn] = await db
				.insert(CoursesReviews)
				.values({
					course_id: courseId,
					user_id: session.data.id,
					rating: review.stars,
					comment: review.review
				})
				.returning();
			revalidatePath(`/course/${enrollment.slug}`);
			return {
				success: true as const,
				data: reviewReturn
			};
		}
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof Error
					? error.message
					: 'An error occurred while creating the review'
		};
	}
}
