import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z.string().email('Invalid Email'),
	password: z.string().min(1, 'Password is required')
});
