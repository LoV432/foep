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
import { Users } from '@/db/schema';
import { desc, count } from 'drizzle-orm';
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
	if (session.data.role !== 'admin') {
		redirect('/');
	}

	const page = parseInt(searchParams.page || '1', 10);
	const pageSize = 20;
	const offset = (page - 1) * pageSize;

	const usersQuery = db
		.select({
			user_id: Users.user_id,
			name: Users.name,
			email: Users.email,
			role: Users.role,
			created_at: Users.created_at,
			email_verified: Users.email_verified
		})
		.from(Users)
		.orderBy(desc(Users.created_at), desc(Users.user_id))
		.limit(pageSize)
		.offset(offset);

	const totalCountQuery = db.select({ value: count() }).from(Users);

	const [users, [{ value: totalCount }]] = await Promise.all([
		usersQuery,
		totalCountQuery
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto mb-7 flex items-center justify-between">
				<h1 className="text-2xl font-bold">User List</h1>
				<Button asChild>
					<Link href="/admin/users/new">Create New User</Link>
				</Button>
			</div>
			<div className="container mx-auto overflow-x-auto rounded-lg bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead className="hidden md:table-cell">Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="hidden md:table-cell">Status</TableHead>
							<TableHead className="hidden md:table-cell">Join Date</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.user_id}>
								<TableCell className="text-wrap break-all font-medium">
									{user.name}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{user.email}
								</TableCell>
								<TableCell>
									<Badge variant="outline" className="capitalize">
										{user.role}
									</Badge>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Badge
										variant={user.email_verified ? 'default' : 'secondary'}
									>
										{user.email_verified ? 'Verified' : 'Unverified'}
									</Badge>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{new Date(user.created_at).toLocaleDateString()}
								</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon" className="h-12 w-12 p-0">
										<Link
											href={`/admin/users/edit/${user.user_id}`}
											className="flex h-full w-full items-center justify-center gap-2"
										>
											<Pencil className="h-4 w-4" />
											<span className="sr-only">Edit {user.name}</span>
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
						{totalCount} users
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
