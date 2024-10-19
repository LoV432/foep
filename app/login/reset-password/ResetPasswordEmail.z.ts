import { z } from 'zod';

export const ResetPasswordEmailSchema = z.object({
	email: z.string().email('Please enter a valid email address')
});
