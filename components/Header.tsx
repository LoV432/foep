import { getSession } from '@/lib/auth';
import Logo from './Logo';
import { Button } from './ui/button';
import Link from 'next/link';
import ProfilePic from './ProfilePic';

export default async function Header() {
	const session = await getSession();
	return (
		<header className="flex items-center bg-primary p-4">
			<Logo />
			{session.success ? (
				<div className="ml-auto flex items-center space-x-4">
					<Button asChild variant="secondary">
						<Link href="/all-courses">Find a Course</Link>
					</Button>
					<ProfilePic
						userName={session.data.name}
						isPrivileged={
							session.data.role === 'admin' ||
							session.data.role === 'instructor'
						}
					/>
				</div>
			) : (
				<div className="ml-auto flex items-center space-x-4">
					<Button asChild variant="secondary">
						<Link href="/all-courses">Find a Course</Link>
					</Button>
					<Button asChild variant="secondary" className="ml-auto bg-white">
						<Link href="/login">Login</Link>
					</Button>
				</div>
			)}
		</header>
	);
}
