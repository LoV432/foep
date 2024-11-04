import Header from '@/components/Header';
import { db } from '@/db/db';
import { CoursesCategories } from '@/db/schema';
import Main from './Main';
import { z } from 'zod';
import { filtersSchema } from './Filters.z';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'All Courses | FOEP',
	description: 'FOEP - Fictional Online Education Platform'
};

export default async function CourseListingPage({
	searchParams
}: {
	searchParams: { filters?: string };
}) {
	const categoriesPromise = db.select().from(CoursesCategories);
	let parsedFilters: z.infer<typeof filtersSchema>;
	try {
		parsedFilters = filtersSchema.parse(
			JSON.parse(searchParams?.filters || '{}')
		);
	} catch {
		parsedFilters = filtersSchema.parse({});
	}
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8 lg:px-6">
				<h2 className="mb-4 text-2xl font-semibold">All Courses</h2>
				<div className="flex flex-col gap-12 lg:flex-row">
					<Main
						categoriesPromise={categoriesPromise}
						parsedFilters={parsedFilters}
					/>
				</div>
			</div>
		</div>
	);
}
