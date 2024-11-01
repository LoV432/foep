import { db } from '@/db/db';
import { CoursesReviews, Users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type Reviews = ReturnType<typeof getReviews>;

export async function getReviews(courseId: number) {
	try {
		const reviews = await db
			.select({
				name: Users.name,
				comment: CoursesReviews.comment,
				stars: CoursesReviews.rating
			})
			.from(CoursesReviews)
			.leftJoin(Users, eq(CoursesReviews.user_id, Users.user_id))
			.where(eq(CoursesReviews.course_id, courseId));
		return {
			success: true as const,
			data: reviews
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof Error
					? error.message
					: 'An error occurred while getting reviews'
		};
	}
}
