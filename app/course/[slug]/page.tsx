import { Star, Clock, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { getCourse } from '@/lib/get_course';
import Header from '@/components/Header';
import Image from 'next/image';
import rehypeRaw from 'rehype-raw';
import { redirect } from 'next/navigation';
export default async function CoursePage({
	params
}: {
	params: { slug: string };
}) {
	const { data, success } = await getCourse(params.slug);

	if (!success) {
		redirect('/');
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
								src={data.image_url}
								alt={data.course.name}
								className="max-h-[300px] w-full object-cover"
								width={500}
								height={500}
							/>
							<div className="prose max-w-none">
								<ReactMarkdown rehypePlugins={[rehypeRaw]}>
									{data.course.long_description.replaceAll('\\n', '\n')}
								</ReactMarkdown>
							</div>
							<div className="flex space-x-4 text-sm text-gray-500">
								<div className="flex items-center">
									<FileText className="mr-2 h-5 w-5" />
									<span>
										{
											data.chapters.filter(
												(chapter) => chapter.type === 'article'
											).length
										}{' '}
										chapters
									</span>
								</div>
								<div className="flex items-center">
									<HelpCircle className="mr-2 h-5 w-5" />
									<span>
										{
											data.chapters.filter((chapter) => chapter.type === 'quiz')
												.length
										}{' '}
										quizzes
									</span>
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

									<div className="border-t pt-4">
										<h3 className="mb-3 font-semibold text-gray-900">
											Course Content
										</h3>
										<div className="space-y-3">
											{data.chapters.map((chapter, index: number) => (
												<div key={index} className="flex items-start space-x-3">
													{chapter.type === 'quiz' ? (
														<HelpCircle className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
													) : (
														<FileText className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
													)}
													<div className="flex w-full justify-between pt-0.5">
														<p className="text-sm font-medium text-gray-900">
															{chapter.title}
														</p>
														<div className="flex items-center space-x-2">
															<Clock className="h-4 w-4 text-gray-400" />
															<span className="text-xs text-gray-500">
																{chapter.estimated_time} min
															</span>
															<span className="text-xs capitalize text-gray-500">
																• {chapter.type}
															</span>
														</div>
													</div>
												</div>
											))}
										</div>
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
