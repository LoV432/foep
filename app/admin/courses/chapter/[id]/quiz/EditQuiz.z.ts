import { z } from 'zod';

export const editQuizMetadataSchema = z.object({
	chapterId: z.number(),
	courseId: z.number(),
	title: z.string().min(1, 'Chapter title is required'),
	estimatedTime: z
		.string()
		.min(1, 'Estimated time is required')
		.refine((val) => !isNaN(parseInt(val)), 'Estimated time must be a number')
});

export const editQuizSchema = z.object({
	quiz_question_id: z.number(),
	question: z.string().min(1, 'Question is required'),
	options: z
		.array(z.object({ text: z.string().min(1, 'Option text is required') }))
		.min(2, 'At least 2 options are required'),
	correct_option_id: z.number().min(0, 'Correct option is required')
});

export type EditQuizMetadataFormData = z.infer<typeof editQuizMetadataSchema>;
export type EditQuizFormData = z.infer<typeof editQuizSchema>;
