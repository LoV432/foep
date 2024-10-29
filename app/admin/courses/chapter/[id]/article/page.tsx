import { db } from '@/db/db';
import { Article, CourseChapters, Courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ArticleForm from './ArticleForm';

export default async function ArticlePage({
	params
}: {
	params: { id: string };
}) {
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
			.select()
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

	const article = (
		await db
			.select()
			.from(Article)
			.where(eq(Article.course_chapter_id, chapter.course_chapter_id))
	)[0];

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto p-4">
				<h1 className="mb-4 text-2xl font-bold">
					{article
						? `Edit Article for: ${course.name}`
						: `Create Article for: ${course.name}`}
				</h1>
				<ArticleForm
					chapterId={chapter.course_chapter_id}
					courseId={course.course_id}
					initialData={{
						title: chapter.title,
						estimatedTime: chapter.estimated_time,
						content: article?.content,
						imageUrl: article?.image_url
					}}
				/>
			</div>
		</div>
	);
}
