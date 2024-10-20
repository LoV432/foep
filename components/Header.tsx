import { getSession } from '@/lib/auth';
import Logo from './Logo';
import { Button } from './ui/button';
import Link from 'next/link';

export default async function Header() {
	const session = await getSession();
	return (
		<header className="flex items-center bg-primary p-4">
			<Logo />
			{session.success ? (
				<Button
					asChild
					variant="secondary"
					className="ml-auto bg-white text-primary"
				>
					<Link href="/dashboard">Dashboard</Link>
				</Button>
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
