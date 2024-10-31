import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/db/db';
import { eq, and, lt, gt, asc, desc } from 'drizzle-orm';
import { CourseChapters, Article, Users, Courses } from '@/db/schema';
import { redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Header from '@/components/Header';

export default async function Page({
	params
}: {
	params: { slug: string; id: string };
}) {
	const data = (
		await db
			.select({
				courseData: CourseChapters,
				articleData: Article,
				authorData: {
					name: Users.name
				}
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
					eq(CourseChapters.course_chapter_id, parseInt(params.id)),
					eq(Courses.slug, params.slug)
				)
			)
	)[0];

	if (!data || !data.articleData || !data.authorData) {
		redirect('/');
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
			<div className="mx-auto max-w-4xl p-6">
				<h1 className="mb-4 text-3xl font-bold">{data.courseData.title}</h1>

				<div className="mb-6 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Reading time: {data.courseData.estimated_time} minutes
					</p>
					<p className="text-sm text-muted-foreground">
						Author: {data.authorData.name}
					</p>
				</div>
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
						<ReactMarkdown rehypePlugins={[rehypeRaw]}>
							{data.articleData.content}
						</ReactMarkdown>
					</div>
				</Card>

				<div className="flex">
					{previous[0] && (
						<Button asChild variant="outline">
							<Link
								href={`/course/${params.slug}/chapter/${previous[0].course_chapter_id}/${previous[0].type}`}
							>
								← {previous[0].title} ({previous[0].estimated_time} min,{' '}
								{previous[0].type})
							</Link>
						</Button>
					)}
					{next[0] && (
						<Button asChild className="ml-auto">
							<Link
								href={`/course/${params.slug}/chapter/${next[0].course_chapter_id}/${next[0].type}`}
							>
								{next[0].title} ({next[0].estimated_time} min, {next[0].type}) →
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
