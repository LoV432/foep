'use server';

import { db } from '@/db/db';
import { Courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function deleteCourseAction(courseId: number) {
	try {
		const session = await getSession();
		if (
			!session.success ||
			(session.data.role !== 'instructor' && session.data.role !== 'admin')
		) {
			throw new Error('Unauthorized');
		}

		await db
			.delete(Courses)
			.where(
				and(
					eq(Courses.course_id, courseId),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			);
		return { success: true as const, message: 'Course deleted successfully' };
	} catch (error) {
		console.error(error);
		return { success: false as const, message: 'Failed to delete course' };
	}
}
