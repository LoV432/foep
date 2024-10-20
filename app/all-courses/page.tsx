import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Info } from 'lucide-react';
import Header from '@/components/Header';

// Mock data for courses
const courses = [
	{
		id: 1,
		title: 'Introduction to React',
		description: 'Learn the basics of React and build your first app.',
		author: 'Jane Doe',
		price: 49.99,
		rating: 4.5,
		image: 'https://picsum.photos/600?random=1',
		category: 'Web Development'
	},
	{
		id: 2,
		title: 'Advanced JavaScript Techniques',
		description: 'Master advanced concepts in JavaScript programming.',
		author: 'John Smith',
		price: 79.99,
		rating: 4.8,
		image: 'https://picsum.photos/600?random=2',
		category: 'Programming'
	},
	{
		id: 3,
		title: 'Python for Data Science',
		description:
			'Learn Python programming for data analysis and visualization.',
		author: 'Emily Chen',
		price: 69.99,
		rating: 4.7,
		image: 'https://picsum.photos/600?random=3',
		category: 'Data Science'
	},
	{
		id: 4,
		title: 'UI/UX Design Fundamentals',
		description:
			'Master the principles of user interface and user experience design.',
		author: 'Alex Johnson',
		price: 59.99,
		rating: 4.6,
		image: 'https://picsum.photos/600?random=4',
		category: 'Design'
	},
	{
		id: 5,
		title: 'Digital Marketing Strategies',
		description:
			'Learn effective digital marketing techniques for business growth.',
		author: 'Sarah Thompson',
		price: 89.99,
		rating: 4.9,
		image: 'https://picsum.photos/600?random=5',
		category: 'Business'
	},
	{
		id: 6,
		title: 'Machine Learning Basics',
		description:
			'Introduction to machine learning algorithms and applications.',
		author: 'Michael Lee',
		price: 99.99,
		rating: 4.7,
		image: 'https://picsum.photos/600?random=6',
		category: 'Data Science'
	},
	{
		id: 7,
		title: 'Full Stack Web Development',
		description: 'Learn to build complete web applications from front to back.',
		author: 'David Brown',
		price: 129.99,
		rating: 4.8,
		image: 'https://picsum.photos/600?random=7',
		category: 'Web Development'
	},
	{
		id: 8,
		title: 'Mobile App Design',
		description: 'Create stunning mobile app interfaces for iOS and Android.',
		author: 'Lisa Wang',
		price: 74.99,
		rating: 4.5,
		image: 'https://picsum.photos/600?random=8',
		category: 'Design'
	},
	{
		id: 9,
		title: 'Cybersecurity Fundamentals',
		description: 'Learn essential cybersecurity concepts and best practices.',
		author: 'Robert Taylor',
		price: 84.99,
		rating: 4.6,
		image: 'https://picsum.photos/600?random=9',
		category: 'Programming'
	},
	{
		id: 10,
		title: 'Entrepreneurship 101',
		description: 'Start and grow your own business with proven strategies.',
		author: 'Emma Davis',
		price: 69.99,
		rating: 4.7,
		image: 'https://picsum.photos/600?random=10',
		category: 'Business'
	},
	{
		id: 11,
		title: 'Artificial Intelligence Ethics',
		description:
			'Explore ethical considerations in AI development and deployment.',
		author: 'Daniel Wilson',
		price: 79.99,
		rating: 4.8,
		image: 'https://picsum.photos/600?random=11',
		category: 'Data Science'
	},
	{
		id: 12,
		title: 'Responsive Web Design',
		description:
			'Create websites that look great on all devices and screen sizes.',
		author: 'Olivia Martinez',
		price: 54.99,
		rating: 4.6,
		image: 'https://picsum.photos/600?random=12',
		category: 'Web Development'
	}
];

const categories = [
	'Web Development',
	'Programming',
	'Data Science',
	'Design',
	'Business'
];

export default function CourseListingPage() {
	const filteredCourses = courses;

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
									key={category}
									className="flex items-center space-x-2 pb-2"
								>
									<Checkbox className="rounded-[4px]" id={category} />
									<Label htmlFor={category}>{category}</Label>
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
							{filteredCourses.map((course) => (
								<Card
									key={course.id}
									className="group flex flex-col overflow-clip transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
								>
									<div className="relative">
										<Image
											src={course.image}
											alt={course.title}
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
												{course.title}
											</h2>
											<p className="mb-2 text-muted-foreground">
												{course.description}
											</p>
											<p className="text-sm text-muted-foreground">
												By {course.author}
											</p>
										</div>
										<div className="mt-4">
											<div className="flex items-center justify-between">
												<span className="text-lg font-bold">
													${course.price.toFixed(2)}
												</span>
												<div className="flex items-center">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`h-5 w-5 ${
																i < Math.floor(course.rating)
																	? 'fill-current text-yellow-400'
																	: 'text-gray-300'
															}`}
														/>
													))}
													<span className="ml-1 text-sm text-muted-foreground">
														({course.rating.toFixed(1)})
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
