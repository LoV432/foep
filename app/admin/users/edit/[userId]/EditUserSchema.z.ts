import { z } from 'zod';

export const userEditSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	role: z.enum(['user', 'admin', 'instructor'], {
		required_error: 'Please select a role'
	}),
	email_verified: z.boolean().default(false)
});
