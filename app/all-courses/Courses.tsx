'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import type { GetCoursesResponse } from '../../lib/get_courses';
import { filtersSchema } from './Filters.z';
import { z } from 'zod';

async function fetchCourses(filters: z.infer<typeof filtersSchema>) {
	const response = await fetch(
		`/api/courses?filters=${encodeURIComponent(JSON.stringify(filters))}`
	);
	if (!response.ok) {
		throw new Error((await response.json()).message);
	}
	return (await response.json()) as GetCoursesResponse;
}

export default function Courses({
	filters,
	onPageChange
}: {
	filters: z.infer<typeof filtersSchema>;
	onPageChange: (page: number) => void;
}) {
	const {
		data: coursesData,
		isLoading,
		isPlaceholderData,
		error
	} = useQuery({
		queryKey: ['courses', filters],
		queryFn: () => fetchCourses(filters),
		placeholderData: (previousData) => previousData
	});

	if (error)
		return (
			<main className="my-auto grid w-full place-items-center md:w-3/4">
				An error occurred: {error.message}
			</main>
		);

	const courses = coursesData?.data;
	const pagination = coursesData?.pagination;

	return (
		<main className="w-full md:w-3/4">
			{isLoading ||
				(isPlaceholderData && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
						<Spinner className="h-12 w-12 text-primary" />
					</div>
				))}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{courses?.map((data) => (
					<Card
						key={data.course.course_id}
						className="group relative flex flex-col overflow-clip transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div className="relative">
							<Image
								src={data.course.image_url ?? ''}
								alt={data.course.name}
								width={300}
								height={200}
								className="h-48 w-full object-cover"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
								<Button
									variant="secondary"
									className="bg-primary text-primary-foreground hover:bg-primary/90"
								>
									<Info className="mr-2 h-4 w-4" />
									View Details
								</Button>
							</div>
						</div>
						<CardContent className="flex flex-grow flex-col justify-between p-4">
							<div>
								<h2 className="mb-2 text-xl font-semibold">
									{data.course.name}
								</h2>
								<p className="mb-2 text-muted-foreground">
									{data.course.short_description}
								</p>
								<p className="text-sm text-muted-foreground">
									By {data.author}
								</p>
							</div>
							<div className="mt-4">
								<div className="flex items-center justify-between">
									<span className="text-lg font-bold">
										${data.course.price?.toFixed(2)}
									</span>
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-5 w-5 ${
													i < data.averageRating
														? 'fill-current text-yellow-400'
														: 'text-gray-300'
												}`}
											/>
										))}
										<span className="ml-1 text-sm text-muted-foreground">
											({data.totalReviews})
										</span>
									</div>
								</div>
							</div>
						</CardContent>
						<Link
							className="absolute inset-0"
							href={`/course/${data.course.slug}`}
							key={data.course.course_id}
						/>
					</Card>
				))}
			</div>
			{pagination && (
				<div className="mt-8 flex justify-center">
					<Button
						onClick={() => onPageChange(pagination.currentPage - 1)}
						disabled={pagination.currentPage === 1}
					>
						Previous
					</Button>
					<span className="mx-4 my-auto">
						Page {pagination.currentPage} of {pagination.totalPages}
					</span>
					<Button
						onClick={() => onPageChange(pagination.currentPage + 1)}
						disabled={pagination.currentPage === pagination.totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</main>
	);
}
