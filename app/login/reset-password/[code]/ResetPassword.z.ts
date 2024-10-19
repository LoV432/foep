import { z } from 'zod';

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(10, 'Password must be at least 10 characters long'),
		confirmPassword: z
			.string()
			.min(10, 'Password must be at least 10 characters long')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
