import { db } from '@/db/db';
import Quiz from './Quiz';
import { CourseChapters, Courses, QuizQuestions } from '@/db/schema';
import { and, eq, lt, gt, sql, desc, asc } from 'drizzle-orm';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';

export default async function QuizPage({
	params
}: {
	params: { id: number; slug: string };
}) {
	const course = (
		await db
			.select({
				chapterInfo: {
					title: CourseChapters.title,
					estimated_time: CourseChapters.estimated_time,
					course_id: CourseChapters.course_id,
					order: CourseChapters.order
				},
				questions: sql<
					{
						question: string;
						options: {
							id: number;
							text: string;
						}[];
						correct_option_id: number;
						order: number;
					}[]
				>`json_agg(json_build_object(
				'question', ${QuizQuestions.question},
				'options', ${QuizQuestions.options},
				'correct_option_id', ${QuizQuestions.correct_option_id},
				'order', ${QuizQuestions.order}
			))`
			})
			.from(Courses)
			.leftJoin(
				CourseChapters,
				and(
					eq(Courses.course_id, CourseChapters.course_id),
					eq(CourseChapters.course_chapter_id, params.id)
				)
			)
			.leftJoin(
				QuizQuestions,
				eq(CourseChapters.course_chapter_id, QuizQuestions.course_chapter_id)
			)
			.where(eq(Courses.slug, params.slug))
			.groupBy(
				CourseChapters.title,
				CourseChapters.estimated_time,
				CourseChapters.course_id,
				CourseChapters.order
			)
	)[0];
	if (!course || !course.chapterInfo || course.questions.length === 0) {
		redirect('/');
	}
	const [previous, next] = await Promise.all([
		db
			.select({
				title: CourseChapters.title,
				estimated_time: CourseChapters.estimated_time,
				type: CourseChapters.type,
				course_chapter_id: CourseChapters.course_chapter_id
			})
			.from(CourseChapters)
			.where(
				and(
					eq(CourseChapters.course_id, course.chapterInfo.course_id),
					lt(CourseChapters.order, course.chapterInfo.order)
				)
			)
			.orderBy(desc(CourseChapters.order))
			.limit(1),
		db
			.select({
				title: CourseChapters.title,
				estimated_time: CourseChapters.estimated_time,
				type: CourseChapters.type,
				course_chapter_id: CourseChapters.course_chapter_id
			})
			.from(CourseChapters)
			.where(
				and(
					eq(CourseChapters.course_id, course.chapterInfo.course_id),
					gt(CourseChapters.order, course.chapterInfo.order)
				)
			)
			.orderBy(asc(CourseChapters.order))
			.limit(1)
	]);
	return (
		<div className="flex min-h-screen flex-col bg-gray-100">
			<Header />
			<div className="mb-24 flex flex-1 flex-col items-center justify-center">
				<Quiz
					data={{
						chapterInfo: course.chapterInfo,
						questions: course.questions
					}}
					navigation={{
						slug: params.slug,
						previous: previous[0],
						next: next[0]
					}}
				/>
			</div>
		</div>
	);
}
