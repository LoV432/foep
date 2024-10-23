import { z } from 'zod';

export const uploadFormSchema = z.object({
	// TODO: Make this a proper file type
	file: z.string().refine((file) => file.length > 0, 'Image is required'),
	friendly_name: z.string().optional(),
	alt_text: z.string().optional()
});
