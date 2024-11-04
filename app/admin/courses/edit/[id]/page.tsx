import { db } from '@/db/db';
import { Courses, CourseChapters, Media } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CourseEditSection from './CourseMetaInfo/CourseEditSection';
import CourseChaptersSection from './CourseChapters/CourseChaptersSection';

export default async function CoursePage({
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

	const { course, resourcesName } = (
		await db
			.select({
				course: Courses,
				resourcesName: Media.friendly_name
			})
			.from(Courses)
			.leftJoin(Media, eq(Media.url, Courses.resources_url))
			.where(
				and(
					session.data.role === 'admin'
						? undefined
						: eq(Courses.author_id, session.data.id),
					eq(Courses.course_id, parseInt(params.id))
				)
			)
	)[0];

	if (!course) {
		return redirect('/admin/courses');
	}

	const chapters = await db
		.select()
		.from(CourseChapters)
		.where(eq(CourseChapters.course_id, course.course_id))
		.orderBy(CourseChapters.order);

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold">Edit Course</h1>
				<div className="grid grid-cols-1 gap-8 py-5 lg:grid-cols-[2fr_1fr]">
					<CourseEditSection course={course} resourcesName={resourcesName} />

					<CourseChaptersSection
						courseId={course.course_id}
						initialChapters={chapters}
					/>
				</div>
			</div>
		</div>
	);
}
