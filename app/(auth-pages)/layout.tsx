import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'AUTH | FOEP',
	description: 'FOEP - Fictional Online Education Platform'
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();
	if (session.success) {
		// These pages should not be accessible if the user is logged in
		// This could be handled with middleware but this is simpler for now
		redirect('/dashboard');
	}
	return children;
}
