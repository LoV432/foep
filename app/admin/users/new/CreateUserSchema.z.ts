import { z } from 'zod';

export const createUserSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(1, 'Password is required'),
	role: z.enum(['user', 'admin', 'instructor']).default('user')
});
