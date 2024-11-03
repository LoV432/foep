'use client';

import { destroySession } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
	const router = useRouter();
	return (
		<div
			onClick={async () => {
				await destroySession();
				router.push('/login');
			}}
			className="flex items-center"
		>
			<LogOut className="mr-2 h-4 w-4" />
			<span>Logout</span>
		</div>
	);
}
