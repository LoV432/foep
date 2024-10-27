import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';

export default function InstructorCourseLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="grid min-h-screen grid-rows-[auto_1fr]">
			<Header />
			<div className="grid min-[1126px]:grid-cols-[200px_1fr]">
				<AdminSidebar />
				{children}
			</div>
		</div>
	);
}
