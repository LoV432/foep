import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';
import { Courses } from '@/db/schema';
import { desc, eq, count } from 'drizzle-orm';
import Link from 'next/link';

export default async function Component({
	searchParams
}: {
	searchParams: { page?: string };
}) {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}
	if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
		redirect('/');
	}

	const page = parseInt(searchParams.page || '1', 10);
	const pageSize = 20;
	const offset = (page - 1) * pageSize;

	const coursesQuery = db
		.select({
			course_id: Courses.course_id,
			name: Courses.name,
			price: Courses.price,
			image_url: Courses.image_url,
			short_description: Courses.short_description,
			is_draft: Courses.is_draft
		})
		.from(Courses)
		.where(
			session.data.role === 'admin'
				? undefined
				: eq(Courses.author_id, session.data.id)
		)
		.orderBy(desc(Courses.course_id))
		.limit(pageSize)
		.offset(offset);

	const totalCountQuery = db
		.select({ value: count() })
		.from(Courses)
		.where(
			session.data.role === 'admin'
				? undefined
				: eq(Courses.author_id, session.data.id)
		);

	const [courses, [{ value: totalCount }]] = await Promise.all([
		coursesQuery,
		totalCountQuery
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto mb-7 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Course List</h1>
				<Button>
					<Link href="/admin/courses/add">Add Course</Link>
				</Button>
			</div>
			<div className="container mx-auto overflow-x-auto rounded-lg bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="hidden w-[100px] md:table-cell">
								Image
							</TableHead>
							<TableHead>Name</TableHead>
							<TableHead className="hidden md:table-cell">
								Description
							</TableHead>
							<TableHead className="hidden text-right md:table-cell">
								Price
							</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{courses.map((course) => (
							<TableRow key={course.course_id}>
								<TableCell className="hidden md:table-cell">
									<Image
										src={course.image_url}
										alt={course.name}
										width={50}
										height={50}
										className="h-16 w-16 rounded-md object-cover"
									/>
								</TableCell>
								<TableCell className="font-medium">{course.name}</TableCell>
								<TableCell className="hidden md:table-cell">
									{course.short_description}
								</TableCell>
								<TableCell className="hidden text-right md:table-cell">
									${course.price.toFixed(2)}
								</TableCell>
								<TableCell>
									<Badge variant={course.is_draft ? 'secondary' : 'default'}>
										{course.is_draft ? 'Draft' : 'Published'}
									</Badge>
								</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon" className="h-12 w-12 p-0">
										<Link
											href={`/admin/courses/edit/${course.course_id}`}
											className="flex h-full w-full items-center justify-center gap-2"
										>
											<Pencil className="h-4 w-4" />
											<span className="sr-only">Edit {course.name}</span>
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="mt-4 flex items-center justify-center">
				<div className="flex space-x-4">
					<Button disabled={page === 1} className="w-20 p-0">
						<Link
							className="flex h-full w-full items-center justify-center"
							href={`?page=${page - 1}`}
						>
							Previous
						</Link>
					</Button>
					<div className="my-auto text-sm text-gray-700">
						Showing {offset + 1} to {Math.min(offset + pageSize, totalCount)} of{' '}
						{totalCount} courses
					</div>
					<Button disabled={page === totalPages} className="w-20 p-0">
						<Link
							className="flex h-full w-full items-center justify-center"
							href={`?page=${page + 1}`}
						>
							Next
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
