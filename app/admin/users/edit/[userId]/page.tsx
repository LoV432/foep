import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { UserEditForm } from './UserEditForm';

export default async function EditUserPage({
	params
}: {
	params: { userId: string };
}) {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}
	if (session.data.role !== 'admin') {
		redirect('/');
	}
	if (isNaN(parseInt(params.userId))) {
		redirect('/admin/users');
	}
	const user = (
		await db
			.select()
			.from(Users)
			.where(eq(Users.user_id, parseInt(params.userId)))
	)[0];
	if (!user) {
		redirect('/admin/users');
	}

	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto max-w-2xl">
				<div className="mb-7">
					<h1 className="text-2xl font-bold">Edit User</h1>
					<p className="text-gray-600">Edit user details for {user.name}</p>
				</div>
				<div className="rounded-lg bg-white p-6">
					<UserEditForm user={user} />
				</div>
			</div>
		</div>
	);
}
