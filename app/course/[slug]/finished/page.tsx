import { Trophy, PartyPopper } from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from '@/components/ui/card';
import { db } from '@/db/db';
import { Courses, CourseEnrollments, CoursesReviews } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReviewForm } from './ReviewForm';

export default async function Page({ params }: { params: { slug: string } }) {
	const session = await getSession();
	if (!session.success) {
		redirect(`/course/${params.slug}`);
	}
	const [enrollment] = await db
		.select({
			courseName: Courses.name,
			courseId: Courses.course_id
		})
		.from(CourseEnrollments)
		.leftJoin(Courses, eq(Courses.slug, params.slug))
		.where(
			and(
				eq(CourseEnrollments.course_id, Courses.course_id),
				eq(CourseEnrollments.user_id, session.data.id),
				eq(CourseEnrollments.completed, true)
			)
		);
	if (!enrollment || !enrollment.courseName || !enrollment.courseId) {
		redirect(`/course/${params.slug}`);
	}

	const [checkReview] = await db
		.select({
			rating: CoursesReviews.rating,
			comment: CoursesReviews.comment
		})
		.from(CoursesReviews)
		.where(
			and(
				eq(CoursesReviews.course_id, enrollment.courseId),
				eq(CoursesReviews.user_id, session.data.id)
			)
		);
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					<div className="mb-4 flex justify-center space-x-2">
						<Trophy className="h-8 w-8 text-yellow-500" />
						<PartyPopper className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-3xl font-bold">Congratulations!</CardTitle>
					<CardDescription className="mt-2 text-xl">
						You've completed the course:
					</CardDescription>
					<h2 className="mt-2 text-2xl font-semibold text-primary">
						{enrollment.courseName}
					</h2>
				</CardHeader>
				<CardContent>
					<ReviewForm
						courseId={enrollment.courseId}
						slug={params.slug}
						previousReview={checkReview}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
