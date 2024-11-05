'use server';

import { editCourseSchema } from './EditCourse.z';
import { z } from 'zod';
import { db } from '@/db/db';
import { Courses } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function editCourseAction(data: z.infer<typeof editCourseSchema>) {
	try {
		const session = await getSession();
		if (
			!session.success ||
			(session.data.role !== 'instructor' && session.data.role !== 'admin')
		) {
			throw new Error('Unauthorized');
		}
		const parsedData = editCourseSchema.parse(data);

		const course = await db
			.update(Courses)
			.set({
				category_id: parseInt(parsedData.category),
				name: parsedData.name,
				price: parseFloat(parsedData.price),
				short_description: parsedData.shortDescription,
				long_description: parsedData.largeDescription,
				image_url: parsedData.imageUrl,
				resources_url: parsedData.resourcesUrl,
				is_draft: parsedData.isDraft
			})
			.where(
				and(
					eq(Courses.course_id, parsedData.courseId),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			)
			.returning();
		revalidateTag('all-courses');
		return {
			success: true as const,
			course
		};
	} catch (error) {
		console.error(error);
		return {
			success: false as const,
			message: 'Failed to create course'
		};
	}
}
