import Link from 'next/link';
import Image from 'next/image';
import { Book, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { Courses, CourseEnrollments, CourseChapters, Users } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

export default async function Page() {
	const session = await getSession();
	if (!session.success) {
		redirect(`/login`);
	}
	const userName = session.data.name;
	const enrolledCourses = await db
		.select({
			id: Courses.course_id,
			slug: Courses.slug,
			isFinished: CourseEnrollments.completed,
			courseName: Courses.name,
			courseId: Courses.course_id,
			chapterId: CourseChapters.course_chapter_id,
			image: Courses.image_url,
			description: Courses.short_description,
			author: Users.name,
			currentChapterName: CourseChapters.title,
			estimatedTime: CourseChapters.estimated_time,
			type: CourseChapters.type
		})
		.from(CourseEnrollments)
		.leftJoin(Courses, eq(Courses.course_id, CourseEnrollments.course_id))
		.leftJoin(
			CourseChapters,
			eq(CourseChapters.course_chapter_id, CourseEnrollments.current_chapter_id)
		)
		.leftJoin(Users, eq(Users.user_id, Courses.author_id))
		.where(eq(CourseEnrollments.user_id, session.data.id))
		.orderBy(CourseEnrollments.enrolled_at);
	//TODO: This should have pagination
	return (
		<>
			<Header />
			<div className="container mx-auto max-w-3xl p-4">
				<h1 className="mb-6 text-4xl font-bold">Welcome back, {userName}!</h1>
				<h2 className="mb-4 text-2xl font-semibold">Your Enrolled Courses</h2>
				<ul className="space-y-4">
					{enrolledCourses.map((course) => (
						<li key={course.id}>
							<Link
								href={
									course.isFinished
										? `/course/${course.slug}`
										: `/course/${course.slug}/chapter/${course.chapterId}/${course.type}`
								}
								className="relative block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
							>
								<div className="flex items-center space-x-4">
									<div className="relative">
										<Image
											src={course.image || ''}
											alt={course.courseName || `${course.courseName} image`}
											width={50}
											height={50}
											className="rounded-md"
										/>
										{course.isFinished && (
											<div
												className="absolute -right-2 -top-2 rounded-full bg-green-500 p-1"
												aria-hidden="true"
											>
												<CheckCircle className="h-4 w-4 text-white" />
											</div>
										)}
									</div>
									<div className="flex-grow">
										<h3 className="text-lg font-semibold">
											{course.courseName}
											{course.isFinished && (
												<span className="sr-only">(Finished)</span>
											)}
										</h3>
										<p className="mb-2 text-sm text-muted-foreground">
											{course.description}
										</p>
										<div className="flex items-center space-x-4">
											<div className="flex items-center">
												<Book className="mr-1 h-4 w-4" />
												<span className="text-sm">{course.author}</span>
											</div>
											{!course.isFinished && (
												<>
													<div className="flex items-center">
														<Clock className="mr-1 h-4 w-4" />
														<span className="text-sm">
															{course.estimatedTime} Minutes
														</span>
													</div>
													<Badge
														variant={
															course.type === 'quiz' ? 'secondary' : 'default'
														}
													>
														{course.type === 'quiz' ? 'Quiz' : 'Chapter'}
													</Badge>
												</>
											)}
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</div>
								{!course.isFinished && (
									<div className="mt-2 text-sm font-medium">
										Current Chapter: {course.currentChapterName}
									</div>
								)}
								{course.isFinished && (
									<div className="mt-2 text-sm font-bold text-primary">
										Course Completed
									</div>
								)}
							</Link>
						</li>
					))}
				</ul>
				{enrolledCourses.length === 0 && (
					<div className="space-y-4 py-10 text-center text-xl text-muted-foreground">
						<p>You haven't enrolled in any courses yet.</p>
						<Button asChild>
							<Link href="/all-courses">Find a Course</Link>
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
