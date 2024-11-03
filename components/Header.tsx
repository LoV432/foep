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
				<div className="ml-auto">
					<ProfilePic userName={session.data.name} />
				</div>
			) : (
				<Button
					asChild
					variant="secondary"
					className="ml-auto bg-white text-primary"
				>
					<Link href="/login">Login</Link>
				</Button>
			)}
		</header>
	);
}
