'use server';

import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { createUserSchema } from './CreateUserSchema.z';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

export async function createUserAction(data: z.infer<typeof createUserSchema>) {
	try {
		const session = await getSession();
		if (!session.success || session.data.role !== 'admin') {
			throw new Error('Unauthorized');
		}
		const parsedData = createUserSchema.parse(data);
		const checkDuplicate = await db
			.select()
			.from(Users)
			.where(eq(Users.email, parsedData.email))
			.limit(1);
		if (checkDuplicate.length > 0) {
			throw new Error('Email already exists!');
		}
		const user = await db
			.insert(Users)
			.values({
				name: parsedData.name,
				email: parsedData.email,
				password: bcrypt.hashSync(parsedData.password, 10),
				role: parsedData.role,
				email_verified: true
			})
			.returning();
		revalidatePath('/admin/users');
		return {
			success: true as const,
			user
		};
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to create user'
		};
	}
}
