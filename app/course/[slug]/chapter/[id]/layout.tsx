import { db } from '@/db/db';
import { CourseEnrollments, Courses } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ChapterLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: { slug: string; id: string };
}) {
	const session = await getSession();
	if (!session.success) {
		redirect(`/course/${params.slug}`);
	}
	const [checkEnrollment] = await db
		.select()
		.from(CourseEnrollments)
		.leftJoin(Courses, eq(CourseEnrollments.course_id, Courses.course_id))
		.where(
			and(
				eq(CourseEnrollments.user_id, session.data.id),
				eq(Courses.slug, params.slug)
			)
		);
	if (!checkEnrollment) {
		redirect(`/course/${params.slug}`);
	}
	return <>{children}</>;
}
