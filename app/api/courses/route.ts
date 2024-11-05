import { NextRequest, NextResponse } from 'next/server';
import { getCourses } from '@/lib/get_courses';
import { filtersSchema } from '@/app/all-courses/Filters.z';
import { unstable_cache } from 'next/cache';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const filters = searchParams.get('filters') || '{}';

	let parsedFilters;
	try {
		parsedFilters = filtersSchema.parse(JSON.parse(filters));
	} catch {
		parsedFilters = filtersSchema.parse({});
	}

	const courses = await unstable_cache(
		() => getCourses(parsedFilters),
		['all-courses', JSON.stringify(parsedFilters)],
		{
			revalidate: false,
			tags: ['all-courses']
		}
	)();
	return NextResponse.json(courses);
}
