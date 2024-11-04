import {
	BookOpen,
	DollarSign,
	Loader2,
	Users as UsersIcon
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardBarChart, DashboardLineChart } from './Charts';

import { and, count, eq, sql, desc, sum } from 'drizzle-orm';
import {
	CourseEnrollments,
	Courses,
	CoursesCategories,
	Users
} from '@/db/schema';
import { db } from '@/db/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { TotalsSuspense } from './TotalsSuspense';

export type Totals = ReturnType<typeof getTotals>;
export type EnrollmentData = ReturnType<typeof getEnrollmentData>;
export type TopCategoriesData = ReturnType<typeof getTopCategoriesData>;
export type TopCoursesData = ReturnType<typeof getTopCoursesData>;

async function getEnrollmentData(authorRole: string, authorId: number) {
	const result = await db
		.select({
			month: sql<string>`to_char(${CourseEnrollments.enrolled_at}, 'Mon')`,
			enrollments: count()
		})
		.from(CourseEnrollments)
		.leftJoin(Courses, eq(CourseEnrollments.course_id, Courses.course_id))
		.where(
			and(
				sql`${CourseEnrollments.enrolled_at} >= date_trunc('year', CURRENT_DATE)`,
				sql`${CourseEnrollments.enrolled_at} < date_trunc('year', CURRENT_DATE) + interval '1 year'`,
				authorRole === 'admin' ? undefined : eq(Courses.author_id, authorId)
			)
		)
		.groupBy(
			sql`to_char(${CourseEnrollments.enrolled_at}, 'Mon')`,
			sql`date_trunc('month', ${CourseEnrollments.enrolled_at})`
		)
		.orderBy(sql`date_trunc('month', ${CourseEnrollments.enrolled_at})`);

	return result;
}

async function getTopCategoriesData(authorRole: string, authorId: number) {
	const result = await db
		.select({
			category: CoursesCategories.name,
			courses: count(Courses.course_id)
		})
		.from(CoursesCategories)
		.leftJoin(Courses, eq(CoursesCategories.category_id, Courses.category_id))
		.where(
			and(
				eq(Courses.is_draft, false),
				authorRole === 'admin' ? undefined : eq(Courses.author_id, authorId)
			)
		)
		.groupBy(CoursesCategories.category_id, CoursesCategories.name)
		.orderBy(desc(count(Courses.course_id)))
		.limit(5);

	return result;
}

async function getTopCoursesData(authorRole: string, authorId: number) {
	const result = await db
		.select({
			course: Courses.name,
			enrollments: count(CourseEnrollments.course_id)
		})
		.from(CourseEnrollments)
		.leftJoin(Courses, eq(CourseEnrollments.course_id, Courses.course_id))
		.where(
			and(
				eq(Courses.is_draft, false),
				authorRole === 'admin' ? undefined : eq(Courses.author_id, authorId)
			)
		)
		.groupBy(Courses.course_id, Courses.name)
		.orderBy(desc(count(CourseEnrollments.course_id)))
		.limit(5);

	return result;
}

function getTotals(authorRole: string, authorId: number) {
	async function getTotalUsers() {
		return (
			await db
				.select({
					total: count(Users.user_id)
				})
				.from(Users)
				.where(eq(Users.email_verified, true))
				.limit(1)
		)[0];
	}

	async function getTotalCourses() {
		return (
			await db
				.select({
					total: count(Courses.course_id)
				})
				.from(Courses)
				.where(
					and(
						eq(Courses.is_draft, false),
						authorRole === 'admin' ? undefined : eq(Courses.author_id, authorId)
					)
				)
				.limit(1)
		)[0];
	}

	async function getTotalRevenue() {
		return (
			await db
				.select({
					total: sum(Courses.price)
				})
				.from(CourseEnrollments)
				.leftJoin(Courses, eq(CourseEnrollments.course_id, Courses.course_id))
				.where(
					and(
						authorRole === 'admin' ? undefined : eq(Courses.author_id, authorId)
					)
				)
				.limit(1)
		)[0];
	}
	return {
		totalUsers: getTotalUsers(),
		totalCourses: getTotalCourses(),
		totalRevenue: getTotalRevenue()
	};
}

// const enrollmentData = [
// 	{ month: 'Jan', enrollments: 65 },
// 	{ month: 'Feb', enrollments: 59 },
// 	{ month: 'Mar', enrollments: 80 },
// 	{ month: 'Apr', enrollments: 81 },
// 	{ month: 'May', enrollments: 56 },
// 	{ month: 'Jun', enrollments: 55 },
// 	{ month: 'Jul', enrollments: 40 }
// ];

// const topCategoriesData = [
// 	{ category: 'Web Development', courses: 25 },
// 	{ category: 'Data Science', courses: 18 },
// 	{ category: 'Mobile Development', courses: 15 },
// 	{ category: 'Design', courses: 12 },
// 	{ category: 'Business', courses: 10 }
// ];

export default async function DashboardPage() {
	const session = await getSession();
	if (
		!session.success ||
		(session.data.role !== 'admin' && session.data.role !== 'instructor')
	) {
		redirect('/login');
	}
	const [role, id] = [session.data.role, session.data.id];
	const enrollmentData = getEnrollmentData(role, id);
	const topCategoriesData = getTopCategoriesData(role, id);
	const topCoursesData = getTopCoursesData(role, id);
	const { totalUsers, totalCourses, totalRevenue } = getTotals(role, id);
	return (
		<div className="space-y-4 overflow-hidden bg-gray-200 p-8 pt-6">
			<div className="container mx-auto flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>
			<div className="container mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<UsersIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							<Suspense fallback={<Loading />}>
								<TotalsSuspense totals={totalUsers} />
							</Suspense>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Courses
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							<Suspense fallback={<Loading />}>
								<TotalsSuspense totals={totalCourses} />
							</Suspense>
						</div>
					</CardContent>
				</Card>
				<Card className="overflow-scroll">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							<Suspense fallback={<Loading />}>
								$<TotalsSuspense totals={totalRevenue} />
							</Suspense>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="container mx-auto">
				<Card className="flex min-h-[300px] flex-col">
					<Suspense fallback={<Loading />}>
						<DashboardLineChart enrollmentData={enrollmentData} />
					</Suspense>
				</Card>
			</div>
			<div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card className="flex min-h-[300px] flex-col">
					<Suspense fallback={<Loading />}>
						<DashboardBarChart
							title="Top Course Categories"
							description="Number of courses in each category"
							data={topCategoriesData}
							dataKeys={{ y: 'courses', x: 'category' }}
						/>
					</Suspense>
				</Card>
				<Card className="flex min-h-[300px] flex-col">
					<Suspense fallback={<Loading />}>
						<DashboardBarChart
							title="Top Courses"
							description="Number of enrollments in each course"
							data={topCoursesData}
							dataKeys={{ y: 'enrollments', x: 'course' }}
						/>
					</Suspense>
				</Card>
			</div>
		</div>
	);
}

function Loading() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<Loader2 className="h-6 w-6 animate-spin" />
		</div>
	);
}
