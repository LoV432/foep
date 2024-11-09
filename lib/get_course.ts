import { db } from '@/db/db';
import { Courses, CoursesCategories, Users, CourseChapters } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export type GetCourseResponse = Awaited<ReturnType<typeof getCourse>>;

export async function getCourse(slug: string) {
	try {
		const averageRating = db.execute(
			sql<{
				average_rating: number;
			}>`SELECT coalesce(ROUND(AVG(rating), 0)::integer, 0) AS average_rating FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
		);
		const totalReviews = db.execute(
			sql<{
				total_reviews: number;
			}>`SELECT coalesce(COUNT(*), 0)::integer AS total_reviews FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
		);

		const courses = await db
			.select({
				course: Courses,
				category: CoursesCategories,
				averageRating: sql<number>`${averageRating}`,
				totalReviews: sql<number>`${totalReviews}`,
				author: Users.name,
				image_url: Courses.image_url
			})
			.from(Courses)
			.leftJoin(
				CoursesCategories,
				eq(Courses.category_id, CoursesCategories.category_id)
			)
			.leftJoin(Users, eq(Courses.author_id, Users.user_id))
			.where(and(eq(Courses.slug, slug), eq(Courses.is_draft, false)));
		const chapters = await db
			.select({
				title: CourseChapters.title,
				type: CourseChapters.type,
				estimated_time: CourseChapters.estimated_time
			})
			.from(CourseChapters)
			.where(eq(CourseChapters.course_id, courses[0].course.course_id))
			.orderBy(CourseChapters.order);
		return {
			success: true as const,
			data: {
				...courses[0],
				chapters
			}
		};
	} catch (error) {
		console.error(error);
		return {
			success: false as const,
			message: 'Something went wrong while fetching courses'
		};
	}
}
