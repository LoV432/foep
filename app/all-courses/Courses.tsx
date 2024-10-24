import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Star } from 'lucide-react';
import { getCourses } from './get_courses';
import Image from 'next/image';
import { filtersSchema } from './Filters.z';
import { z } from 'zod';

export default async function Courses({ filters }: { filters: string }) {
	let parsedFilters: z.infer<typeof filtersSchema>;
	try {
		parsedFilters = filtersSchema.parse(JSON.parse(filters));
	} catch {
		parsedFilters = filtersSchema.parse({});
	}
	const courses = await getCourses(parsedFilters);
	return (
		<main className="w-full md:w-3/4">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{courses.map((course) => (
					<Card
						key={course.course.course_id}
						className="group flex flex-col overflow-clip transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div className="relative">
							<Image
								src={course.course.image_url}
								alt={course.course.name}
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
									{course.course.name}
								</h2>
								<p className="mb-2 text-muted-foreground">
									{course.course.description}
								</p>
								<p className="text-sm text-muted-foreground">
									By {course.author}
								</p>
							</div>
							<div className="mt-4">
								<div className="flex items-center justify-between">
									<span className="text-lg font-bold">
										${course.course.price?.toFixed(2)}
									</span>
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-5 w-5 ${
													i < course.averageRating
														? 'fill-current text-yellow-400'
														: 'text-gray-300'
												}`}
											/>
										))}
										<span className="ml-1 text-sm text-muted-foreground">
											({course.totalReviews})
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
