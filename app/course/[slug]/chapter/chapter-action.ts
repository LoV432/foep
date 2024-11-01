'use server';

import { db } from '@/db/db';
import { CourseChapters, CourseEnrollments } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { and, eq, gt } from 'drizzle-orm';

export async function moveToNextChapter(
	courseId: number,
	currentChapterOrder: number
) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}

		const [checkEnrollment] = await db
			.select({
				enrollment_id: CourseEnrollments.enrollment_id,
				current_chapter_id: CourseChapters.course_chapter_id,
				order: CourseChapters.order,
				course_id: CourseChapters.course_id
			})
			.from(CourseEnrollments)
			.leftJoin(
				CourseChapters,
				eq(
					CourseEnrollments.current_chapter_id,
					CourseChapters.course_chapter_id
				)
			)
			.where(
				and(
					eq(CourseEnrollments.course_id, courseId),
					eq(CourseEnrollments.user_id, session.data.id)
				)
			);
		if (
			!checkEnrollment.current_chapter_id ||
			!checkEnrollment.course_id ||
			!checkEnrollment.order
		) {
			throw new Error('Not enrolled');
		}
		if (checkEnrollment.order > currentChapterOrder) {
			return { success: true as const, movedChapter: false };
		}

		const [nextChapter] = await db
			.select()
			.from(CourseChapters)
			.where(
				and(
					eq(CourseChapters.course_id, checkEnrollment.course_id),
					gt(
						CourseChapters.course_chapter_id,
						checkEnrollment.current_chapter_id
					)
				)
			);
		if (!nextChapter) {
			throw new Error('No next chapter');
		}

		await db
			.update(CourseEnrollments)
			.set({
				current_chapter_id: nextChapter.course_chapter_id
			})
			.where(
				eq(CourseEnrollments.enrollment_id, checkEnrollment.enrollment_id)
			);

		return { success: true as const, movedChapter: true };
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof Error ? error.message : 'Error moving to next chapter'
		};
	}
}

export async function markCourseComplete(courseId: number) {
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
		// TODO: Maybe i should also check if the user truly is on the last chapter?
		// But i feel like that's a bit of a hassle for no real reason
		if (!checkEnrollment) {
			throw new Error('Not enrolled');
		}

		await db
			.update(CourseEnrollments)
			.set({
				completed: true
			})
			.where(
				and(
					eq(CourseEnrollments.enrollment_id, checkEnrollment.enrollment_id),
					eq(CourseEnrollments.course_id, checkEnrollment.course_id),
					eq(CourseEnrollments.user_id, session.data.id)
				)
			);

		return { success: true as const };
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof Error ? error.message : 'Error marking course complete'
		};
	}
}
