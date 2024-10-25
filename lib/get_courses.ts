import { db } from '@/db/db';
import { Courses, CoursesCategories, Users } from '@/db/schema';
import { and, eq, gte, inArray, ilike, lte, sql, asc, desc } from 'drizzle-orm';
import { filtersSchema } from '@/app/all-courses/Filters.z';
import { z } from 'zod';

export type GetCoursesResponse = Awaited<ReturnType<typeof getCourses>>;

export async function getCourses(filters: z.infer<typeof filtersSchema>) {
	try {
		const averageRating = db.execute(
			sql<{
				average_rating: number;
			}>`SELECT ROUND(AVG(rating), 0) AS average_rating FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
		);
		const totalReviews = db.execute(
			sql<{
				total_reviews: number;
			}>`SELECT COUNT(*) AS total_reviews FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
		);
		const sqlConditions = and(
			filters.selectedCategories.length > 0
				? inArray(Courses.category_id, filters.selectedCategories)
				: undefined,
			gte(Courses.price, filters.priceRange[0]),
			lte(Courses.price, filters.priceRange[1]),
			filters.search ? ilike(Courses.name, `%${filters.search}%`) : undefined,
			gte(averageRating, filters.minRating)
		);

		const courses = await db
			.select({
				course: Courses,
				category: CoursesCategories,
				averageRating: sql<number>`${averageRating}`,
				totalReviews: sql<number>`${totalReviews}`,
				author: Users.name
			})
			.from(Courses)
			.leftJoin(
				CoursesCategories,
				eq(Courses.category_id, CoursesCategories.category_id)
			)
			.leftJoin(Users, eq(Courses.author_id, Users.user_id))
			.where(sqlConditions)
			.orderBy(
				filters.sortByPrice === 'asc' ? asc(Courses.price) : desc(Courses.price)
			);
		return { success: true as const, data: courses };
	} catch (error) {
		console.error(error);
		return {
			success: false as const,
			message: 'Something went wrong while fetching courses'
		};
	}
}
