import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
			<div className="grid min-[1126px]:grid-cols-[200px_1fr]">
				<AdminSidebar session={session.data} />
				{children}
			</div>
			<Toaster />
		</div>
	);
}
