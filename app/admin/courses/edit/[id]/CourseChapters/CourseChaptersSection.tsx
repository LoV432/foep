'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, GripVertical } from 'lucide-react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { CourseChapters } from '@/db/schema';
import { chapterSchema } from './ChapterSchema.z';
import { ChapterFormData } from './ChapterSchema.z';
import { addChapterAction } from './add_chapter_action';

export default function CourseChaptersSection({
	courseId,
	initialChapters
}: {
	courseId: number;
	initialChapters: (typeof CourseChapters.$inferSelect)[];
}) {
	const [chapters, setChapters] = useState(initialChapters);
	const { toast } = useToast();
	const form = useForm<ChapterFormData>({
		resolver: zodResolver(chapterSchema),
		defaultValues: {
			course_id: courseId,
			title: '',
			type: 'article',
			estimatedTime: '0',
			order: chapters.length + 1
		}
	});

	async function onSubmit(data: ChapterFormData) {
		try {
			const result = await addChapterAction(data);
			if (!result.success) {
				throw new Error(result.message);
			}
			toast({
				title: 'Success',
				description: 'Chapter added successfully'
			});
			form.reset();
			setChapters([...chapters, result.chapter]);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to add chapter',
				variant: 'destructive'
			});
		}
	}

	return (
		<Card>
			<CardHeader className="p-6">
				<CardTitle>Course Chapters</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-6">
					<div className="space-y-4">
						{chapters.map((chapter) => (
							<div
								key={chapter.course_chapter_id}
								className="flex items-center gap-4 rounded-lg border p-4"
							>
								<GripVertical className="h-5 w-5 text-gray-500" />
								<div className="flex-1">
									<h3 className="font-medium">{chapter.title}</h3>
									<p className="text-sm text-gray-500">
										{chapter.type[0].toUpperCase() + chapter.type.slice(1)} •{' '}
										{chapter.estimated_time} minutes
									</p>
								</div>
								<Button variant="outline" size="sm">
									Edit
								</Button>
							</div>
						))}
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 rounded-lg border p-4"
						>
							<h3 className="font-medium">Add New Chapter</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Chapter Title</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Enter chapter title" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="article">Article</SelectItem>
													<SelectItem value="quiz">Quiz</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="estimatedTime"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Estimated Time (minutes)</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="number"
													placeholder="Enter estimated time"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="mt-4"
							>
								{form.formState.isSubmitting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Plus className="mr-2 h-4 w-4" />
								)}
								Add Chapter
							</Button>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	);
}
