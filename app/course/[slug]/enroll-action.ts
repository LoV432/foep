'use server';

import { db } from '@/db/db';
import { CourseChapters, CourseEnrollments } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function enrollAction(courseId: number) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		const checkEnrollment = await db
			.select()
			.from(CourseEnrollments)
			.where(
				and(
					eq(CourseEnrollments.course_id, courseId),
					eq(CourseEnrollments.user_id, session.data.id)
				)
			);
		if (checkEnrollment.length > 0) {
			throw new Error('Already enrolled');
		}

		const [firstChapter] = await db
			.select()
			.from(CourseChapters)
			.where(eq(CourseChapters.course_id, courseId))
			.orderBy(asc(CourseChapters.course_chapter_id))
			.limit(1);

		const [enrollment] = await db
			.insert(CourseEnrollments)
			.values({
				user_id: session.data.id,
				course_id: courseId,
				current_chapter_id: firstChapter.course_chapter_id
			})
			.returning();

		return {
			success: true as const,
			data: {
				current_chapter_id: enrollment.current_chapter_id,
				chapterType: firstChapter.type
			}
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof Error
					? error.message
					: 'An error occurred while enrolling'
		};
	}
}

export async function getEnrollment(courseId: number) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		const [checkEnrollment] = await db
			.select()
			.from(CourseEnrollments)
			.where(
				and(
					eq(CourseEnrollments.course_id, courseId),
					eq(CourseEnrollments.user_id, session.data.id)
				)
			);
		if (!checkEnrollment) {
			throw new Error('Not enrolled');
		}
		const [chapterType] = await db
			// TODO: Doing this is incredibly annoying and also slow. I should just merge the quiz and article pages into one
			.select({
				type: CourseChapters.type
			})
			.from(CourseChapters)
			.where(
				eq(CourseChapters.course_chapter_id, checkEnrollment.current_chapter_id)
			);
		return {
			success: true as const,
			data: { ...checkEnrollment, chapterType: chapterType.type }
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof Error
					? error.message
					: 'An error occurred while getting enrollment'
		};
	}
}
