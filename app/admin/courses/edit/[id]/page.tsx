import { db } from '@/db/db';
import { Courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CourseEditSection from './CourseEditSection';

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

	const course = (
		await db
			.select()
			.from(Courses)
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
		return redirect('/instructor/course');
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto flex items-center p-4">
				<h1 className="text-2xl font-bold">Edit Course</h1>
			</div>
			<CourseEditSection course={course} />
		</div>
	);
}
