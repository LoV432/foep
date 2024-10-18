import { z } from 'zod';

export const registerFormSchema = z
	.object({
		name: z.string().trim().min(1, 'Name is required'),
		email: z.string().email('Invalid Email'),
		password: z.string().min(10, 'The password must be minimum 10 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});
