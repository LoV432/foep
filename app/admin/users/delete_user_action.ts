'use server';

import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function deleteUserAction(userId: number) {
	try {
		const session = await getSession();
		if (!session.success || session.data.role !== 'admin') {
			throw new Error('Unauthorized');
		}
		const user = await db
			.delete(Users)
			.where(eq(Users.user_id, userId))
			.returning();

		// Every cache call should have this tag
		// Deleting a user deletes a bunch of other data
		// So we just nuke the whole cache
		revalidateTag('all-cache');
		return {
			success: true as const,
			user
		};
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to delete user'
		};
	}
}
