'use server';

import { db } from '@/db/db';
import { Article, CourseChapters, Courses, QuizQuestions } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { EditQuizFormData, EditQuizMetadataFormData } from './EditQuiz.z';

export async function getQuizAction({ chapterId }: { chapterId: number }) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			throw new Error('Unauthorized');
		}
		const chapter = await db
			.select()
			.from(CourseChapters)
			.where(eq(CourseChapters.course_chapter_id, chapterId));
		if (chapter.length === 0) {
			throw new Error('Chapter not found');
		}

		const course = await db
			.select()
			.from(Courses)
			.where(
				and(
					eq(Courses.course_id, chapter[0].course_id),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			);
		if (course.length === 0) {
			throw new Error('Course not found or you are not authorized to edit it');
		}

		const quizQuestions = await db
			.select()
			.from(QuizQuestions)
			.where(eq(QuizQuestions.course_chapter_id, chapter[0].course_chapter_id))
			.orderBy(asc(QuizQuestions.order));

		return { success: true as const, quizQuestions };
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to get quiz'
		};
	}
}

export async function createEmptyQuizAction({
	chapterId
}: {
	chapterId: number;
}) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			throw new Error('Unauthorized');
		}

		const chapter = await db
			.select()
			.from(CourseChapters)
			.where(eq(CourseChapters.course_chapter_id, chapterId));
		if (chapter.length === 0) {
			throw new Error('Chapter not found');
		}

		const course = await db
			.select()
			.from(Courses)
			.where(
				and(
					eq(Courses.course_id, chapter[0].course_id),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			);
		if (course.length === 0) {
			throw new Error('Course not found or you are not authorized to edit it');
		}

		const quizQuestions = await db
			.select({
				order: QuizQuestions.order
			})
			.from(QuizQuestions)
			.where(eq(QuizQuestions.course_chapter_id, chapter[0].course_chapter_id))
			.orderBy(desc(QuizQuestions.order))
			.limit(1);

		await db.insert(QuizQuestions).values({
			course_chapter_id: chapter[0].course_chapter_id,
			author_id: session.data.id,
			order: quizQuestions[0]?.order + 1 || 1,
			question: '',
			correct_option_id: 0,
			options: []
		});

		return { success: true as const };
	} catch (error) {
		return {
			success: false as const,
			message:
				error instanceof Error ? error.message : 'Failed to create empty quiz'
		};
	}
}

export async function deleteQuizAction({
	quizQuestionId
}: {
	quizQuestionId: number;
}) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			throw new Error('Unauthorized');
		}

		const quizQuestion = await db
			.select()
			.from(QuizQuestions)
			.where(eq(QuizQuestions.quiz_question_id, quizQuestionId));
		if (quizQuestion.length === 0) {
			throw new Error('Quiz question not found');
		}

		const chapter = await db
			.select()
			.from(CourseChapters)
			.where(
				eq(CourseChapters.course_chapter_id, quizQuestion[0].course_chapter_id)
			);
		if (chapter.length === 0) {
			throw new Error('Chapter not found');
		}

		const course = await db
			.select()
			.from(Courses)
			.where(
				and(
					eq(Courses.course_id, chapter[0].course_id),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			);
		if (course.length === 0) {
			throw new Error('Course not found or you are not authorized to edit it');
		}

		await db
			.delete(QuizQuestions)
			.where(eq(QuizQuestions.quiz_question_id, quizQuestionId));

		return { success: true as const };
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to delete quiz'
		};
	}
}

export async function saveQuizAction(data: EditQuizFormData) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			throw new Error('Unauthorized');
		}

		const quizQuestion = await db
			.select()
			.from(QuizQuestions)
			.where(eq(QuizQuestions.quiz_question_id, data.quiz_question_id));
		if (quizQuestion.length === 0) {
			throw new Error('Quiz question not found');
		}

		const chapter = await db
			.select()
			.from(CourseChapters)
			.where(
				eq(CourseChapters.course_chapter_id, quizQuestion[0].course_chapter_id)
			);
		if (chapter.length === 0) {
			throw new Error('Chapter not found');
		}

		const course = await db
			.select()
			.from(Courses)
			.where(
				and(
					eq(Courses.course_id, chapter[0].course_id),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			);
		if (course.length === 0) {
			throw new Error('Course not found or you are not authorized to edit it');
		}

		await db
			.update(QuizQuestions)
			.set({
				question: data.question,
				options: data.options.map((option) => ({
					id: data.options.indexOf(option),
					text: option.text
				})),
				correct_option_id: data.correct_option_id
			})
			.where(eq(QuizQuestions.quiz_question_id, data.quiz_question_id));

		return { success: true as const };
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to save quiz'
		};
	}
}

export async function saveQuizMetadataAction(data: EditQuizMetadataFormData) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			throw new Error('Unauthorized');
		}

		const chapter = await db
			.select()
			.from(CourseChapters)
			.where(eq(CourseChapters.course_chapter_id, data.chapterId));
		if (chapter.length === 0) {
			throw new Error('Chapter not found');
		}

		const course = await db
			.select()
			.from(Courses)
			.where(
				and(
					eq(Courses.course_id, data.courseId),
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id)
				)
			);
		if (course.length === 0) {
			throw new Error('Course not found or you are not authorized to edit it');
		}

		const existingArticle = await db
			.select()
			.from(Article)
			.where(eq(Article.course_chapter_id, data.chapterId));

		if (existingArticle.length > 0) {
			await db
				.update(CourseChapters)
				.set({
					title: data.title,
					estimated_time: parseInt(data.estimatedTime)
				})
				.where(eq(CourseChapters.course_chapter_id, data.chapterId));
		} else {
			await db
				.update(CourseChapters)
				.set({
					title: data.title,
					estimated_time: parseInt(data.estimatedTime)
				})
				.where(eq(CourseChapters.course_chapter_id, data.chapterId));
		}

		return { success: true as const };
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to save article'
		};
	}
}
