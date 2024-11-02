'use server';

import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcrypt';
import {
	updatePasswordSchema,
	updateProfileNameSchema
} from '../app/admin/profile/UpdateSchemas.z';

export async function updatePasswordAction(
	newPassword: string,
	confirmPassword: string
) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		const parsedValues = updatePasswordSchema.parse({
			newPassword,
			confirmPassword
		});
		const hashedPassword = await bcrypt.hash(parsedValues.newPassword, 10);
		await db
			.update(Users)
			.set({ password: hashedPassword })
			.where(eq(Users.user_id, session.data.id));

		return { success: true as const };
	} catch (error) {
		console.error(error);
		return { success: false as const, message: 'Failed to update password' };
	}
}

export async function updateProfileNameAction(name: string) {
	try {
		const parsedValues = updateProfileNameSchema.parse({ name });
		const session = await getSession();
		if (!session.success) throw new Error('Unauthorized');

		await db
			.update(Users)
			.set({ name: parsedValues.name })
			.where(eq(Users.user_id, session.data.id));

		return { success: true as const };
	} catch (error) {
		console.error(error);
		return {
			success: false as const,
			message: 'Failed to update profile name'
		};
	}
}
