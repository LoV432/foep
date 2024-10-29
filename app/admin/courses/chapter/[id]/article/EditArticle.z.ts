import { z } from 'zod';

export const editArticleSchema = z.object({
	chapterId: z.number(),
	courseId: z.number(),
	title: z.string().min(1, 'Chapter title is required'),
	estimatedTime: z
		.string()
		.min(1, 'Estimated time is required')
		.refine((val) => !isNaN(parseInt(val)), 'Estimated time must be a number'),
	content: z.string().min(1, 'Content is required'),
	imageUrl: z.string().url('Invalid image URL').or(z.literal(''))
});

export type EditArticleFormData = z.infer<typeof editArticleSchema>;
