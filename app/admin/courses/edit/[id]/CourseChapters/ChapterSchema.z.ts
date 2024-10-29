import { z } from 'zod';

export const chapterSchema = z.object({
	course_id: z.number().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required'),
	type: z.enum(['article', 'quiz']),
	estimatedTime: z
		.string()
		.min(1, 'Estimated time is required')
		.refine((val) => !isNaN(parseInt(val)), 'Estimated time must be a number'),
	order: z.number()
});

export type ChapterFormData = z.infer<typeof chapterSchema>;
