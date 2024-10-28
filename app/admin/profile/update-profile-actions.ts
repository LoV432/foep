'use server';

import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcrypt';
import {
	updatePasswordSchema,
	updateProfileNameSchema,
	updateProfilePicSchema
} from './UpdateSchemas.z';

export async function updatePasswordAction(
	userId: number,
	newPassword: string,
	confirmPassword: string
) {
	try {
		const parsedValues = updatePasswordSchema.parse({
			userId,
			newPassword,
			confirmPassword
		});
		const hashedPassword = await bcrypt.hash(parsedValues.newPassword, 10);
		await db
			.update(Users)
			.set({ password: hashedPassword })
			.where(eq(Users.user_id, parsedValues.userId));

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to update password' };
	}
}

export async function updateProfilePicAction(
	userId: number,
	avatarUrl: string
) {
	try {
		const parsedValues = updateProfilePicSchema.parse({ userId, avatarUrl });
		const session = await getSession();
		if (!session.success) throw new Error('Unauthorized');
		if (session.data.role !== 'admin' && session.data.role !== 'instructor')
			throw new Error('Unauthorized');

		await db
			.update(Users)
			.set({ avatar_url: parsedValues.avatarUrl })
			.where(eq(Users.user_id, parsedValues.userId));

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to update profile picture' };
	}
}

export async function updateProfileNameAction(userId: number, name: string) {
	try {
		const parsedValues = updateProfileNameSchema.parse({ userId, name });
		const session = await getSession();
		if (!session.success) throw new Error('Unauthorized');
		if (session.data.role !== 'admin' && session.data.role !== 'instructor')
			throw new Error('Unauthorized');

		await db
			.update(Users)
			.set({ name: parsedValues.name })
			.where(eq(Users.user_id, parsedValues.userId));

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to update profile name' };
	}
}
