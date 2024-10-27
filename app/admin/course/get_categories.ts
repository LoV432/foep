'use server';

import { db } from '@/db/db';
import { CoursesCategories } from '@/db/schema';

export async function getCategories() {
	const categories = await db.select().from(CoursesCategories);
	return categories;
}
