import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Admin Dashboard | FOEP',
	description: 'FOEP - Fictional Online Education Platform'
};

export default async function InstructorCourseLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}
	if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
		redirect('/');
	}
	return (
		<div className="grid min-h-screen grid-rows-[auto_1fr]">
			<Header />
			<div className="grid max-[1126px]:grid-rows-[40px_1fr] min-[1126px]:grid-cols-[200px_1fr]">
				<AdminSidebar session={session.data} />
				{children}
			</div>
		</div>
	);
}
