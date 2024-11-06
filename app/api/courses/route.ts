import { NextRequest, NextResponse } from 'next/server';
import { getCourses } from '@/lib/get_courses';
import { filtersSchema } from '@/app/all-courses/Filters.z';
import { withCache } from '@/lib/with-cache';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const filters = searchParams.get('filters') || '{}';

	let parsedFilters;
	try {
		parsedFilters = filtersSchema.parse(JSON.parse(filters));
	} catch {
		parsedFilters = filtersSchema.parse({});
	}

	const courses = await withCache(
		() => getCourses(parsedFilters),
		['all-courses-page', JSON.stringify(parsedFilters)],
		60 * 60 * 24 * 7
	);
	return NextResponse.json(courses);
}
