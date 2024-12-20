'use server';

import { addCourseSchema } from './AddCourse.z';
import { z } from 'zod';
import { db } from '@/db/db';
import { Courses } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { kebabCase } from '@/lib/kebab-case';
import { randomUUID } from 'crypto';
import { revalidateTag } from 'next/cache';

export async function createCourseAction(
	data: z.infer<typeof addCourseSchema>
) {
	try {
		const session = await getSession();
		if (
			!session.success ||
			(session.data.role !== 'instructor' && session.data.role !== 'admin')
		) {
			throw new Error('Unauthorized');
		}
		const parsedData = addCourseSchema.parse(data);

		const course = await db
			.insert(Courses)
			.values({
				category_id: parseInt(parsedData.category),
				name: parsedData.name,
				price: parseFloat(parsedData.price),
				short_description: parsedData.shortDescription,
				long_description: parsedData.largeDescription,
				image_url: parsedData.imageUrl,
				is_draft: parsedData.isDraft,
				author_id: session.data.id,
				slug: kebabCase(parsedData.name) + '-' + randomUUID()
			})
			.returning();
		revalidateTag('all-courses-page');
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
