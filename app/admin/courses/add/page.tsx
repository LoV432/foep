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
import { Loader2, Save } from 'lucide-react';
import UploadDialog from '@/components/UploadDialog/UploadDialog';
import Image from 'next/image';
import { getCategories } from '../get_categories';
import { CoursesCategories } from '@/db/schema';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import Editor from '@/components/Editor';
import { addCourseSchema } from './AddCourse.z';
type FormData = z.infer<typeof addCourseSchema>;
import { createCourse } from './create_course';
import { useRouter } from 'next/navigation';

export default function CourseCreationPage() {
	const [categories, setCategories] = useState<
		(typeof CoursesCategories.$inferSelect)[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(addCourseSchema),
		defaultValues: {
			name: '',
			price: '',
			shortDescription: '',
			category: '',
			imageUrl: '',
			largeDescription: '',
			isDraft: true
		}
	});

	async function onSubmit(data: FormData) {
		setIsLoading(true);
		try {
			const course = await createCourse(data);
			if (course.success) {
				router.push(`/instructor/course/${course.course[0].course_id}`);
			} else {
				setError('Failed to create course. Please try again.');
				setIsLoading(false);
			}
		} catch (error) {
			setError('Failed to create course. Please try again.');
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getCategories().then((fetchedCategories) => {
			setCategories(fetchedCategories);
		});
	}, []);

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="top-0 z-10 border-b border-gray-200 bg-white min-[1126px]:sticky">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<h1 className="text-2xl font-bold">Create New Course</h1>
					<div>
						<Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Save className="mr-2 h-4 w-4" />
							)}
							Publish
						</Button>
					</div>
				</div>
			</header>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<main className="container mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row">
						<div className="lg:w-2/3">
							<Card>
								<CardContent className="p-6">
									<div className="space-y-6">
										{error && <div className="text-red-500">{error}</div>}

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
