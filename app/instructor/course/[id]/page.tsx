import { db } from '@/db/db';
import { Courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CourseEditPage from './CourseEditPage';

export default async function CoursePage({
	params
}: {
	params: { id: string };
}) {
	if (isNaN(parseInt(params.id))) {
		return redirect('/instructor/course');
	}
	const session = await getSession();
	if (!session.success) {
		return redirect('/login');
	}
	if (session.data.role !== 'instructor' && session.data.role !== 'admin') {
		return redirect('/');
	}

	const course = (
		await db
			.select()
			.from(Courses)
			.where(
				and(
					eq(Courses.author_id, session.data.id),
					eq(Courses.course_id, parseInt(params.id))
				)
			)
	)[0];

	if (!course) {
		return redirect('/instructor/course');
	}

	return <CourseEditPage course={course} />;
}
