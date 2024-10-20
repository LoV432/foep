import { getSession } from '@/lib/auth';
import Logo from './Logo';
import { Button } from './ui/button';
import Link from 'next/link';

export default async function Header() {
	const session = await getSession();
	return (
		<header className="flex items-center gap-2 bg-primary p-4">
			<Logo width={40} height={40} />
			<h1 className="text-3xl font-semibold text-white">FOEP</h1>
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
