'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';
import FiltersSidebar from './FiltersSidebar';
import Courses from './Courses';
import { CoursesCategories } from '@/db/schema';
import { z } from 'zod';
import { filtersSchema } from './Filters.z';

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
		window.history.replaceState(
			{},
			'',
			`/all-courses?filters=${JSON.stringify(queryFilters)}`
		);
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
