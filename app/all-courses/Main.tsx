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
		updateFilters,
		parsedFilters
	);

	const [debouncedFiltersState, setDebouncedFiltersState] =
		useState(filtersState);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedFiltersState(filtersState);
		}, 100);

		return () => clearTimeout(timer);
	}, [filtersState]);

	useEffect(() => {
		window.history.replaceState(
			{},
			'',
			`/all-courses?filters=${JSON.stringify(debouncedFiltersState)}`
		);
	}, [debouncedFiltersState]);
	return (
		<>
			<FiltersSidebar
				filtersState={filtersState}
				categoriesPromise={categoriesPromise}
				dispatchFilters={dispatchFilters}
			/>
			<Courses filters={debouncedFiltersState} />
		</>
	);
}
