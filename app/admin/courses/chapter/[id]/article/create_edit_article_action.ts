'use server';

import { db } from '@/db/db';
import { Article, CourseChapters, Courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { EditArticleFormData } from './EditArticle.z';

export async function saveArticleAction(data: EditArticleFormData) {
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
			await db.transaction(async (tx) => {
				await tx
					.update(CourseChapters)
					.set({
						title: data.title,
						estimated_time: parseInt(data.estimatedTime)
					})
					.where(eq(CourseChapters.course_chapter_id, data.chapterId));
				await tx
					.update(Article)
					.set({ content: data.content, image_url: data.imageUrl })
					.where(
						eq(Article.course_chapter_id, existingArticle[0].course_chapter_id)
					);
			});
		} else {
			await db.transaction(async (tx) => {
				await tx
					.update(CourseChapters)
					.set({
						title: data.title,
						estimated_time: parseInt(data.estimatedTime)
					})
					.where(eq(CourseChapters.course_chapter_id, data.chapterId));
				await tx.insert(Article).values({
					content: data.content,
					course_chapter_id: chapter[0].course_chapter_id,
					author_id: session.data.id,
					image_url: data.imageUrl
				});
			});
		}

		return { success: true as const };
	} catch (error) {
		return {
			success: false as const,
			message: error instanceof Error ? error.message : 'Failed to save article'
		};
	}
}
