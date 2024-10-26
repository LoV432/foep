import { Star, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { getCourse } from '@/lib/get_course';
import Header from '@/components/Header';
import Image from 'next/image';

export default async function CoursePage({
	params
}: {
	params: { slug: string };
}) {
	const { data, success } = await getCourse(params.slug);

	if (!success) {
		return <div>Course not found</div>;
	}
	return (
		<div className="min-h-screen bg-gray-100">
			<Header />
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row">
					<div className="mb-8 pr-0 lg:mb-0 lg:w-[70%] lg:pr-8">
						<div className="space-y-6 overflow-hidden bg-white p-6 shadow sm:rounded-lg">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									{data.course.name}
								</h1>
								<p className="mt-1 text-sm text-gray-500">by {data.author}</p>
							</div>
							<Image
								src={data.media_url ?? ''}
								alt={data.course.name}
								className="max-h-[300px] w-full object-cover"
								width={500}
								height={500}
							/>
							<div className="prose max-w-none">
								<ReactMarkdown>
									{data.course.long_description?.replaceAll('\\n', '\n')}
								</ReactMarkdown>
							</div>
							<div className="flex space-x-4 text-sm text-gray-500">
								<div className="flex items-center">
									<UsersIcon className="mr-2 h-5 w-5" />
									{/* <span>{course.chapters} chapters</span> */}
								</div>
								<div className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2 h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
										<path
											fillRule="evenodd"
											d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
											clipRule="evenodd"
										/>
									</svg>
									{/* <span>{course.quizzes} quizzes</span> */}
								</div>
							</div>
						</div>
					</div>

					<div className="lg:w-[30%]">
						<div className="sticky top-4">
							<Card className="shadow-lg">
								<CardContent className="space-y-6 p-6">
									<div className="text-center">
										<p className="text-4xl font-bold text-gray-900">
											${data.course.price}
										</p>
										<Button className="mt-4 w-full" size="lg">
											Enroll Now
										</Button>
									</div>
									<div className="flex items-center justify-center space-x-2">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`h-5 w-5 ${
														i < Math.floor(data.averageRating)
															? 'text-yellow-400'
															: 'text-gray-300'
													}`}
													fill="currentColor"
												/>
											))}
										</div>
										<span className="text-lg font-medium text-gray-900">
											{data.averageRating.toFixed(1)}
										</span>
										<span className="text-sm text-gray-500">
											({data.totalReviews} ratings)
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
