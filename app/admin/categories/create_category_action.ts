'use server';

import { db } from '@/db/db';
import { CoursesCategories } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { createCategorySchema } from './CreateCategorySchema.z';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(
	data: z.infer<typeof createCategorySchema>
) {
	try {
		const session = await getSession();
		if (!session.success || session.data.role !== 'admin') {
			throw new Error('Unauthorized');
		}
		const parsedData = createCategorySchema.parse(data);
		const checkDuplicate = await db
			.select()
			.from(CoursesCategories)
			.where(eq(CoursesCategories.name, parsedData.name))
			.limit(1);
		if (checkDuplicate.length > 0) {
			throw new Error('Category already exists!');
		}
		const category = await db
			.insert(CoursesCategories)
			.values({
				name: parsedData.name
			})
			.returning();
		revalidatePath('/admin/categories');
		return {
			success: true as const,
			category
		};
	} catch (error) {
		return {
			success: false as const,
			message:
				error instanceof Error ? error.message : 'Failed to create category'
		};
	}
}
