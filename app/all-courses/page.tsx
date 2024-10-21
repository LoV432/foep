import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Info } from 'lucide-react';
import Header from '@/components/Header';
import { db } from '@/db/db';
import { Courses, CoursesCategories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function CourseListingPage() {
	const averageRating = db.execute(
		sql<{
			average_rating: number;
		}>`SELECT AVG(rating) AS average_rating FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
	);
	const totalReviews = db.execute(
		sql<{
			total_reviews: number;
		}>`SELECT COUNT(*) AS total_reviews FROM "CoursesReviews" WHERE course_id = "Courses".course_id`
	);

	const courses = await db
		.select({
			course: Courses,
			category: CoursesCategories,
			averageRating: sql<number>`${averageRating}`,
			totalReviews: sql<number>`${totalReviews}`
		})
		.from(Courses)
		.leftJoin(
			CoursesCategories,
			eq(Courses.category_id, CoursesCategories.category_id)
		);
	const categories = await db.select().from(CoursesCategories);
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8 md:px-6">
				<h2 className="mb-4 text-2xl font-semibold">All Courses</h2>
				<div className="flex flex-col gap-12 md:flex-row">
					{/* Filters Sidebar */}
					<aside className="h-fit w-full space-y-6 rounded-lg border border-border p-6 md:w-1/4">
						<div>
							<Label className="mb-2 text-lg font-semibold" htmlFor="search">
								Search Courses
							</Label>
							<Input id="search" placeholder="Search..." />
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">Categories</h2>
							{categories.map((category) => (
								<div
									key={category.category_id}
									className="flex items-center space-x-2 pb-2"
								>
									<Checkbox className="rounded-[4px]" id={category.name} />
									<Label htmlFor={category.name}>{category.name}</Label>
								</div>
							))}
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">Price Range</h2>
							<Slider min={0} max={200} step={1} />
							<div className="mt-2 flex justify-between">
								<span>$0</span>
								<span>$200</span>
							</div>
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">Minimum Rating</h2>
							<Slider min={0} max={5} step={0.5} />
							<div className="mt-2">0 stars and up</div>
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">Sort by Price</h2>
							<Button variant="outline" className="w-full justify-between">
								Price: High to Low
							</Button>
						</div>
					</aside>

					{/* Course Listings */}
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
												By {course.course.author_id}
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
				</div>
			</div>
		</div>
	);
}
