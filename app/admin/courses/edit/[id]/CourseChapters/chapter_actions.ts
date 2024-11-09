'use server';

import { db } from '@/db/db';
import { ChapterFormData } from './ChapterSchema.z';
import { getSession } from '@/lib/auth';
import { CourseChapters, Courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function addChapterAction(data: ChapterFormData) {
	try {
		const session = await getSession();
		if (!session.success) {
			return {
				success: false as const,
				message: 'Unauthorized'
			};
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			return {
				success: false as const,
				message: 'Unauthorized'
			};
		}

		const course = (
			await db
				.select()
				.from(Courses)
				.where(
					and(
						eq(Courses.course_id, data.course_id),
						session.data.role === 'admin'
							? undefined
							: eq(Courses.author_id, session.data.id)
					)
				)
		)[0];
		if (!course) {
			return {
				success: false as const,
				message:
					'Course not found or you are not authorized to edit this course'
			};
		}

		const chapter = await db
			.insert(CourseChapters)
			.values({
				course_id: data.course_id,
				author_id: session.data.id,
				title: data.title,
				type: data.type,
				estimated_time: parseInt(data.estimatedTime),
				order: data.order
			})
			.returning();
		revalidateTag(`course-overview:${course.slug}`);
		return {
			success: true as const,
			message: 'Chapter added successfully',
			chapter: chapter[0]
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false as const,
				message: error.message
			};
		}
		return {
			success: false as const,
			message: 'Failed to add chapter'
		};
	}
}

export async function deleteChapterAction(chapterId: number) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('Unauthorized');
		}
		if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
			throw new Error('Unauthorized');
		}

		const chapter = (
			await db
				.select()
				.from(CourseChapters)
				.where(
					and(
						eq(CourseChapters.course_chapter_id, chapterId),
						session.data.role === 'admin'
							? undefined
							: eq(CourseChapters.author_id, session.data.id)
					)
				)
		)[0];
		if (!chapter) {
			throw new Error(
				'Chapter not found or you are not authorized to delete this chapter'
			);
		}

		const course = (
			await db
				.select()
				.from(Courses)
				.where(
					and(
						eq(Courses.course_id, chapter.course_id),
						session.data.role === 'admin'
							? undefined
							: eq(Courses.author_id, session.data.id)
					)
				)
		)[0];
		if (!course) {
			throw new Error(
				'Course not found or you are not authorized to delete this chapter'
			);
		}

		await db
			.delete(CourseChapters)
			.where(eq(CourseChapters.course_chapter_id, chapterId));
		revalidateTag(`chapter:${chapter.course_chapter_id}`);
		revalidateTag(`course-overview:${course.slug}`);
		return {
			success: true as const,
			message: 'Chapter deleted successfully'
		};
	} catch (error) {
		return {
			success: false as const,
			message:
				error instanceof Error ? error.message : 'Failed to delete chapter'
		};
	}
}
