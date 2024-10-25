import Header from '@/components/Header';
import FiltersSidebar from './FiltersSidebar';
import Courses from './Courses';
import { db } from '@/db/db';
import { CoursesCategories } from '@/db/schema';

export default async function CourseListingPage({
	searchParams
}: {
	searchParams?: { filters: string };
}) {
	const categoriesPromise = db.select().from(CoursesCategories);
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8 md:px-6">
				<h2 className="mb-4 text-2xl font-semibold">All Courses</h2>
				<div className="flex flex-col gap-12 md:flex-row">
					<FiltersSidebar categoriesPromise={categoriesPromise} />
					<Courses filters={searchParams?.filters ?? ''} />
				</div>
			</div>
		</div>
	);
}
