import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/db/db';
import { eq, and, lt, gt, asc, desc } from 'drizzle-orm';
import { CourseChapters, Article, Users, Courses } from '@/db/schema';
import { redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Header from '@/components/Header';
import NextChapterButton from '../../NextChapterButton';
import CompleteChapterButton from '../../CompleteChapterButton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Metadata } from 'next';
import { withCache } from '@/lib/with-cache';

export const metadata: Metadata = {
	title: 'Course Chapter | FOEP',
	description: 'FOEP - Fictional Online Education Platform'
};

async function getCourseChapter(id: string, slug: string) {
	return (
		await db
			.select({
				courseData: CourseChapters,
				articleData: Article,
				authorData: {
					name: Users.name
				},
				resources: Courses.resources_url
			})
			.from(CourseChapters)
			.leftJoin(
				Article,
				eq(CourseChapters.course_chapter_id, Article.course_chapter_id)
			)
			.leftJoin(Users, eq(Article.author_id, Users.user_id))
			.leftJoin(Courses, eq(CourseChapters.course_id, Courses.course_id))
			.where(
				and(
					eq(CourseChapters.course_chapter_id, parseInt(id)),
					eq(Courses.slug, slug)
				)
			)
	)[0];
}

export default async function Page({
	params
}: {
	params: { slug: string; id: string };
}) {
	const decodedSlug = decodeURIComponent(params.slug);
	const data = await withCache(
		() => getCourseChapter(params.id, decodedSlug),
		['all-chapters', `course:${decodedSlug}`, `chapter:${params.id}`]
	);

	if (!data || !data.articleData || !data.authorData) {
		redirect(`/course/${decodedSlug}`);
	}

	const [previous, next] = await Promise.all([
		db
			.select({
				title: CourseChapters.title,
				estimated_time: CourseChapters.estimated_time,
				type: CourseChapters.type,
				course_chapter_id: CourseChapters.course_chapter_id
			})
			.from(CourseChapters)
			.where(
				and(
					eq(CourseChapters.course_id, data.courseData.course_id),
					lt(CourseChapters.order, data.courseData.order)
				)
			)
			.orderBy(desc(CourseChapters.order))
			.limit(1),
		db
			.select({
				title: CourseChapters.title,
				estimated_time: CourseChapters.estimated_time,
				type: CourseChapters.type,
				course_chapter_id: CourseChapters.course_chapter_id
			})
			.from(CourseChapters)
			.where(
				and(
					eq(CourseChapters.course_id, data.courseData.course_id),
					gt(CourseChapters.order, data.courseData.order)
				)
			)
			.orderBy(asc(CourseChapters.order))
			.limit(1)
	]);

	return (
		<div className="min-h-screen bg-gray-100">
			<Header />
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<h1 className="mb-4 text-3xl font-bold">{data.courseData.title}</h1>

				<div className="mb-6 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Reading time: {data.courseData.estimated_time} minutes
					</p>
				</div>
				<div className="flex flex-col-reverse gap-8 lg:flex-row lg:gap-0">
					<div className="pr-0 lg:mb-0 lg:w-[70%] lg:pr-8">
						{data.articleData.image_url && (
							<Image
								src={data.articleData.image_url}
								alt="Chapter illustration"
								width={800}
								height={400}
								className="mb-6 w-full rounded-lg border-2 border-border"
							/>
						)}
						<Card className="mb-6 p-6">
							<div className="prose max-w-screen-lg dark:prose-invert">
								<ReactMarkdown
									rehypePlugins={[rehypeRaw]}
									components={{
										// https://stackoverflow.com/questions/69848211/using-syntax-highlighter-with-tsx-react-markdown
										code({ className, children, ...props }) {
											const match = /language-(\w+)/.exec(className || '');
											return match ? (
												<SyntaxHighlighter
													style={atomDark}
													language={match[1]}
													PreTag="div"
												>
													{String(children).replace(/\n$/, '')}
												</SyntaxHighlighter>
											) : (
												<code className={className} {...props}>
													{children}
												</code>
											);
										}
									}}
								>
									{data.articleData.content}
								</ReactMarkdown>
							</div>
						</Card>

						<div className="flex flex-wrap gap-4">
							{previous[0] && (
								<Button asChild variant="outline">
									<Link
										href={`/course/${decodedSlug}/chapter/${previous[0].course_chapter_id}/${previous[0].type}`}
									>
										← {previous[0].title} ({previous[0].estimated_time} min,{' '}
										{previous[0].type})
									</Link>
								</Button>
							)}
							{next[0] ? (
								<NextChapterButton
									courseId={data.courseData.course_id}
									redirectUrl={`/course/${decodedSlug}/chapter/${next[0].course_chapter_id}/${next[0].type}`}
									buttonText={`${next[0].title} (${next[0].estimated_time} min, ${next[0].type}) →`}
									currentChapterOrder={data.courseData.order}
								/>
							) : (
								<CompleteChapterButton
									courseId={data.courseData.course_id}
									buttonText="Finish Course 🎉🎉"
									redirectUrl={`/course/${decodedSlug}/finished`}
								/>
							)}
						</div>
					</div>
					{data.resources && (
						<div className="lg:w-[30%]">
							<Card className="sticky top-12 shadow-lg">
								<CardContent className="space-y-6 p-6">
									{data.resources && (
										<div className="flex items-center justify-center space-x-2">
											<div className="flex w-full flex-col justify-between pt-0.5">
												<p className="text-center text-lg font-bold text-gray-900">
													Course Resources
												</p>
												<Button className="mt-4 w-full" size="lg" asChild>
													<Link href={data.resources} target="_blank">
														Download Resources
													</Link>
												</Button>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
