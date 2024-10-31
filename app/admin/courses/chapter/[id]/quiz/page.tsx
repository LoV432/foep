import { db } from '@/db/db';
import { CourseChapters, Courses, QuizQuestions } from '@/db/schema';
import { asc, eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QuizForm from './QuizForm';

export default async function QuizPage({ params }: { params: { id: string } }) {
	const session = await getSession();
	if (!session.success) {
		return redirect('/login');
	}
	if (session.data.role !== 'instructor' && session.data.role !== 'admin') {
		return redirect('/');
	}
	if (isNaN(parseInt(params.id))) {
		return redirect('/admin/courses');
	}

	const chapter = (
		await db
			.select({
				course_chapter_id: CourseChapters.course_chapter_id,
				course_id: CourseChapters.course_id,
				title: CourseChapters.title,
				estimated_time: CourseChapters.estimated_time
			})
			.from(CourseChapters)
			.where(eq(CourseChapters.course_chapter_id, parseInt(params.id)))
	)[0];
	if (!chapter) {
		return redirect('/admin/courses');
	}

	const course = (
		await db
			.select({
				name: Courses.name,
				course_id: Courses.course_id
			})
			.from(Courses)
			.where(
				and(
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id),
					eq(Courses.course_id, chapter.course_id)
				)
			)
	)[0];
	if (!course) {
		return redirect('/admin/courses');
	}

	const quizQuestions = await db
		.select({
			question: QuizQuestions.question,
			options: QuizQuestions.options,
			correct_option_id: QuizQuestions.correct_option_id,
			order: QuizQuestions.order,
			quiz_question_id: QuizQuestions.quiz_question_id
		})
		.from(QuizQuestions)
		.where(eq(QuizQuestions.course_chapter_id, chapter.course_chapter_id))
		.orderBy(asc(QuizQuestions.order));

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto p-4">
				<h1 className="mb-4 text-2xl font-bold">
					{quizQuestions.length > 0
						? `Edit Quiz for: ${course.name}`
						: `Create Quiz for: ${course.name}`}
				</h1>
				<QuizForm chapterData={chapter} />
			</div>
		</div>
	);
}
