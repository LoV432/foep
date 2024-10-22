import { Button } from '@/components/ui/button';
import { getSession, destroySession } from '@/lib/auth';
import Link from 'next/link';
import { ALLOWED_FILE_TYPES } from '@/app/api/upload/route';

export default async function DashboardPage() {
	const session = await getSession();
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
			<h1>Debugging</h1>
			<Button asChild>
				<Link href="/register">Register</Link>
			</Button>
			<Button asChild>
				<Link href="/login">Login</Link>
			</Button>
			<form action={destroySession}>
				<Button type="submit">Logout</Button>
			</form>
			<form action="/api/upload" method="post" encType="multipart/form-data">
				<input type="file" name="file" accept={ALLOWED_FILE_TYPES.join(',')} />
				<Button type="submit">Upload</Button>
			</form>
			<pre className="text-xl">{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
}
