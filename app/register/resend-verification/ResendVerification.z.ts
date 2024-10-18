import { z } from 'zod';

export const ResendVerificationSchema = z.object({
	email: z.string().email('Please enter a valid email address')
});
