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
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function Component() {
	const session = await getSession();
	if (
		!session.success ||
		(session.data.role !== 'admin' && session.data.role !== 'instructor')
	) {
		redirect('/login');
	}
	const courses = await db
		.select({
			course_id: Courses.course_id,
			name: Courses.name,
			price: Courses.price,
			image_url: Courses.image_url,
			short_description: Courses.short_description,
			is_draft: Courses.is_draft
		})
		.from(Courses)
		.where(eq(Courses.author_id, session.data.id));

	return (
		<div className="container mx-auto p-4">
			<div className="mb-7 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Course List</h1>
				<Button>
					<Link href="/admin/course">Add Course</Link>
				</Button>
			</div>
			<div className="overflow-x-auto">
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
		</div>
	);
}
