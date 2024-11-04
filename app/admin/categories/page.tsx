import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { db } from '@/db/db';
import { CoursesCategories, Courses } from '@/db/schema';
import { count, desc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AddCategory from './AddCategory';
export default async function Page() {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}
	if (session.data.role !== 'admin') {
		redirect('/');
	}

	const categories = await db
		.select({
			id: CoursesCategories.category_id,
			name: CoursesCategories.name,
			courseCount: count(Courses.course_id)
		})
		.from(CoursesCategories)
		.leftJoin(Courses, eq(CoursesCategories.category_id, Courses.category_id))
		.groupBy(CoursesCategories.category_id, CoursesCategories.name)
		.orderBy(desc(count(Courses.course_id)), CoursesCategories.name);
	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto mb-7 flex max-w-4xl items-center justify-between">
				<h1 className="text-2xl font-bold">Course Categories</h1>
			</div>

			<AddCategory />
			<div className="container mx-auto max-w-4xl overflow-x-auto rounded-lg bg-white">
				<Table>
					<TableCaption hidden>List of course categories</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Category Name</TableHead>
							<TableHead className="text-right">Number of Courses</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories.map((category) => (
							<TableRow key={category.id}>
								<TableCell>{category.name}</TableCell>
								<TableCell className="text-right">
									{category.courseCount}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
