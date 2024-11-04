import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateUserForm from './CreateUserForm';
import { Card, CardContent } from '@/components/ui/card';

export default async function Page() {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}
	if (session.data.role !== 'admin') {
		redirect('/');
	}

	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto mb-7 flex items-center justify-between">
				<h1 className="text-2xl font-bold">New User</h1>
			</div>
			<div className="container mx-auto max-w-xl">
				<Card className="w-full max-w-md">
					<CardContent className="p-6">
						<CreateUserForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
