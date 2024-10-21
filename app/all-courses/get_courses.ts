import { db } from '@/db/db';
import { Courses, CoursesCategories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function getCourses() {
	const averageRating = db.execute(
		sql<{
			average_rating: number;
		}>`SELECT AVG(rating) AS average_rating FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
	);
	const totalReviews = db.execute(
		sql<{
			total_reviews: number;
		}>`SELECT COUNT(*) AS total_reviews FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
	);

	const courses = await db
		.select({
			course: Courses,
			category: CoursesCategories,
			averageRating: sql<number>`${averageRating}`,
			totalReviews: sql<number>`${totalReviews}`
		})
		.from(Courses)
		.leftJoin(
			CoursesCategories,
			eq(Courses.category_id, CoursesCategories.category_id)
		);
	return courses;
}
