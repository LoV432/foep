'use server';

import { z, ZodError } from 'zod';
import { registerFormSchema } from './FormSchema.z';

export default async function registerAction({
	fields
}: {
	fields: z.infer<typeof registerFormSchema>;
}) {
	try {
		const validatedFields = registerFormSchema.parse(fields);
		return {
			success: true,
			message:
				'Account created successfully. Please check your email for verification.'
		};
	} catch (error) {
		if (error instanceof ZodError) {
			console.log(error.issues);
		} else {
			console.log(error);
		}
		return {
			success: false,
			message: 'Something went wrong. Please try again'
		};
	}
}
