'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import UploadDialog from '@/app/dashboard/UploadDialog';
import Image from 'next/image';
import { getCategories } from '../get_categories';
import { Courses, CoursesCategories } from '@/db/schema';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import Editor from '@/app/dashboard/Editor';
import { editCourseSchema } from './EditCourse.z';
type FormData = z.infer<typeof editCourseSchema>;
import { editCourse } from './edit_course';

export default function CourseEditPage({
	course
}: {
	course: typeof Courses.$inferSelect;
}) {
	const [categories, setCategories] = useState<
		(typeof CoursesCategories.$inferSelect)[]
	>([]);

	const form = useForm<FormData>({
		resolver: zodResolver(editCourseSchema),
		defaultValues: {
			courseId: course.course_id,
			name: course.name,
			price: course.price.toString(),
			shortDescription: course.short_description,
			category: course.category_id.toString(),
			imageUrl: course.image_url,
			largeDescription: course.long_description,
			isDraft: course.is_draft
		}
	});

	async function onSubmit(data: FormData) {
		const course = await editCourse(data);
		console.log('Course edited', course);
	}

	useEffect(() => {
		getCategories().then((fetchedCategories) => {
			setCategories(fetchedCategories);
		});
	}, []);

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="top-0 z-10 border-b border-gray-200 bg-white min-[1126px]:sticky">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<h1 className="text-2xl font-bold">Edit Course</h1>
					<Button onClick={form.handleSubmit(onSubmit)}>
						<Save className="mr-2 h-4 w-4" /> Save
					</Button>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<main className="container mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row">
						<div className="lg:w-2/3">
							<FormField
								control={form.control}
								name="courseId"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input {...field} className="hidden" hidden readOnly />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Card>
								<CardContent className="p-6">
									<div className="space-y-6">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Course Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															className="text-lg font-semibold"
															placeholder="Enter course name"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="shortDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Short Description</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															placeholder="Brief overview of the course"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="largeDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Detailed Description</FormLabel>
													<FormControl>
														<Editor
															value={field.value}
															onChange={(value) => field.onChange(value ?? '')}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</div>

						<aside className="space-y-6 lg:w-1/3">
							<Card>
								<CardContent className="space-y-6 p-6">
									<FormField
										control={form.control}
										name="price"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Price</FormLabel>
												<FormControl>
													<Input {...field} type="text" placeholder="0.00" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a category" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categories.map((category) => (
															<SelectItem
																key={category.category_id}
																value={category.category_id.toString()}
															>
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="imageUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Course Image</FormLabel>
												<FormControl>
													<div className="space-y-2">
														<UploadDialog
															className="border border-border bg-transparent text-black hover:bg-transparent"
															placeholder="Select an image"
															selectedMediaCallback={(media) =>
																field.onChange(media.url)
															}
														/>
														<Input
															{...field}
															type="text"
															placeholder="Select an image"
															hidden
															readOnly
															className="hidden"
														/>
														{field.value && (
															<Image
																src={field.value}
																alt="Course Image"
																width={100}
																className="h-28 w-28 rounded-md"
																height={100}
															/>
														)}
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="isDraft"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Save as Draft
													</FormLabel>
													<FormDescription>
														You can publish your course later.
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</aside>
					</main>
				</form>
			</Form>
		</div>
	);
}
