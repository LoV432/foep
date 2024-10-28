'use server';

import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { userEditSchema } from './EditUserSchema.z';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export async function editUserAction(
	userId: number,
	data: z.infer<typeof userEditSchema>
) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin') {
			throw new Error('Unauthorized');
		}
		const validatedFields = userEditSchema.parse(data);

		await db
			.update(Users)
			.set(validatedFields)
			.where(eq(Users.user_id, userId));

		revalidatePath('/admin/users');
		return { success: true as const };
	} catch (error) {
		console.error(error);
		return { success: false as const, message: 'Failed to update user' };
	}
}
