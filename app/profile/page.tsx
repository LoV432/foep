import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import UpdatePasswordForm from '@/components/UpdatePassword';
import UpdateProfileForm from '@/components/UpdateName';
import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Profile | FOEP',
	description: 'FOEP - Fictional Online Education Platform'
};

export default async function Component() {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}

	const user = (
		await db.select().from(Users).where(eq(Users.user_id, session.data.id))
	)[0];

	return (
		<div className="grid min-h-screen grid-rows-[auto_1fr]">
			<Header />
			<div className="flex w-full flex-col justify-center bg-gray-200 pb-32">
				<div className="container mx-auto mb-7 w-fit">
					<h1 className="text-2xl font-bold">Profile Settings</h1>
				</div>
				<div className="container mx-auto w-fit rounded-lg bg-white p-6">
					<div className="mb-8 flex items-start space-x-6">
						<div className="flex-1 space-y-6">
							<UpdateProfileForm initialName={user.name} />

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={user.email}
									disabled
									className="max-w-md"
								/>
							</div>

							<UpdatePasswordForm />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
