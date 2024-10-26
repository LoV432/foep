import { db } from '@/db/db';
import { Courses, CoursesCategories, Media, Users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export type GetCourseResponse = Awaited<ReturnType<typeof getCourse>>;

export async function getCourse(slug: string) {
	try {
		const averageRating = db.execute(
			sql<{
				average_rating: number;
			}>`SELECT ROUND(AVG(rating), 0)::integer AS average_rating FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
		);
		const totalReviews = db.execute(
			sql<{
				total_reviews: number;
			}>`SELECT COUNT(*)::integer AS total_reviews FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
		);

		const courses = await db
			.select({
				course: Courses,
				category: CoursesCategories,
				averageRating: sql<number>`${averageRating}`,
				totalReviews: sql<number>`${totalReviews}`,
				author: Users.name,
				media_url: Media.url
			})
			.from(Courses)
			.leftJoin(
				CoursesCategories,
				eq(Courses.category_id, CoursesCategories.category_id)
			)
			.leftJoin(Users, eq(Courses.author_id, Users.user_id))
			.leftJoin(Media, eq(Courses.media_id, Media.media_id))
			.where(eq(Courses.slug, slug));
		return {
			success: true as const,
			data: courses[0]
		};
	} catch (error) {
		console.error(error);
		return {
			success: false as const,
			message: 'Something went wrong while fetching courses'
		};
	}
}
