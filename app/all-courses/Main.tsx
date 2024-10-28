'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';
import FiltersSidebar from './FiltersSidebar';
import Courses from './Courses';
import { CoursesCategories } from '@/db/schema';
import { z } from 'zod';
import { filtersSchema } from './Filters.z';
import { useRouter } from 'next/navigation';

export type UpdateFiltersAction = {
	[key in keyof z.infer<typeof filtersSchema>]?: z.infer<
		typeof filtersSchema
	>[key];
};

export default function Main({
	categoriesPromise,
	parsedFilters
}: {
	categoriesPromise: Promise<(typeof CoursesCategories.$inferSelect)[]>;
	parsedFilters: z.infer<typeof filtersSchema>;
}) {
	const router = useRouter();
	function updateFilters(
		state: z.infer<typeof filtersSchema>,
		action: UpdateFiltersAction
	) {
		return filtersSchema.parse({ ...state, ...action });
	}
	const [filtersState, dispatchFilters] = useReducer(
		// This state could techically be moved to FiltersSidebar
		// but doing that would require me to manage page state separately
		updateFilters,
		parsedFilters
	);

	const [queryFilters, setQueryFilters] = useState(filtersState);

	useEffect(() => {
		router.replace(`/all-courses?filters=${JSON.stringify(queryFilters)}`);
		// This breaks the back button :/
		// I would have preferred to use this as it
		// doesn't require a re-render of the page but i haven't found a way to
		// make it work with the back button yet.
		// window.history.replaceState(
		// 	{},
		// 	'',
		// 	`/all-courses?filters=${JSON.stringify(queryFilters)}`
		// );
	}, [queryFilters]);

	const handlePageChange = useCallback(
		(newPage: number) => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			dispatchFilters({ page: newPage });
			setQueryFilters({ ...filtersState, page: newPage });
		},
		[filtersState]
	);

	return (
		<>
			<FiltersSidebar
				filtersState={filtersState}
				categoriesPromise={categoriesPromise}
				dispatchFilters={dispatchFilters}
				setQueryFilters={setQueryFilters}
			/>
			<Courses filters={queryFilters} onPageChange={handlePageChange} />
		</>
	);
}
