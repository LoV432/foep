import { z } from 'zod';

export const updateProfileNameSchema = z.object({
	name: z.string().trim().min(1, 'Name is required')
});

export const updatePasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.trim(),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.trim()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
