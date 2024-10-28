import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import UpdatePasswordForm from './UpdatePassword';
import UpdateProfilePic from './UpdateProfilePic';
import UpdateProfileForm from './UpdateName';

export default async function Component() {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}

	const user = (
		await db.select().from(Users).where(eq(Users.user_id, session.data.id))
	)[0];

	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto mb-7">
				<h1 className="text-2xl font-bold">Profile Settings</h1>
			</div>
			<div className="container mx-auto rounded-lg bg-white p-6">
				<div className="mb-8 flex items-start space-x-6">
					<div className="relative">
						<Image
							src={user.avatar_url || ''}
							alt="Profile picture"
							width={100}
							height={100}
							className="mx-auto h-24 w-24 rounded-full border-2 border-border object-cover"
						/>
						<UpdateProfilePic userId={user.user_id} />
					</div>
					<div className="flex-1 space-y-6">
						<UpdateProfileForm userId={user.user_id} initialName={user.name} />

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

						<UpdatePasswordForm userId={user.user_id} />
					</div>
				</div>
			</div>
		</div>
	);
}
