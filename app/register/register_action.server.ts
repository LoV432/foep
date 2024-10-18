'use server';

import { z, ZodError } from 'zod';
import { registerFormSchema } from './FormSchema.z';
import bcrypt from 'bcrypt';
import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { DatabaseError } from 'pg';

export default async function registerAction({
	fields
}: {
	fields: z.infer<typeof registerFormSchema>;
}) {
	try {
		const validatedFields = registerFormSchema.parse(fields);
		const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

		const newUser = await db
			.insert(Users)
			.values({
				email: validatedFields.email,
				password: hashedPassword,
				name: validatedFields.name
			})
			.returning({ id: Users.user_id });

		return {
			success: true,
			message:
				'Account created successfully. Please check your email for verification.'
		};
	} catch (error) {
		if (error instanceof ZodError) {
			// Technically i can send specific errors from here but should user be told what failed
			// When they are clearly try to bypass the form checks?
			console.log(error.issues);
		} else if (error instanceof DatabaseError) {
			return {
				success: false,
				message: 'User already exists. Please login instead.'
			};
		} else {
			console.log(error);
		}
		return {
			success: false,
			message: 'Something went wrong. Please try again'
		};
	}
}
