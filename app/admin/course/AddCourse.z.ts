import { z } from 'zod';

export const addCourseSchema = z.object({
	name: z.string().min(1, 'Course name is required'),
	price: z
		.string()
		.min(1, 'Price is required')
		.regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to 2 decimal places'),
	shortDescription: z.string().min(1, 'Short description is required'),
	category: z.string().min(1, 'Category is required'),
	imageUrl: z.string().url('Invalid image URL'),
	largeDescription: z.string().min(1, 'Detailed description is required'),
	isDraft: z.boolean()
});
