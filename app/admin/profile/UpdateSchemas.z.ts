import { z } from 'zod';

export const updateProfilePicSchema = z.object({
	userId: z.number(),
	avatarUrl: z.string().url('Invalid URL')
});

export const updateProfileNameSchema = z.object({
	userId: z.number(),
	name: z.string().trim().min(1, 'Name is required')
});

export const updatePasswordSchema = z
	.object({
		userId: z.number(),
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
