'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import Editor from '@/components/Editor';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { editArticleSchema, EditArticleFormData } from './EditArticle.z';
import { saveArticleAction } from './create_edit_article_action';
import Link from 'next/link';
import UploadDialog from '@/components/UploadDialog/UploadDialog';
import Image from 'next/image';

export default function ArticleForm({
	chapterId,
	courseId,
	initialData
}: {
	chapterId: number;
	courseId: number;
	initialData: {
		title: string;
		estimatedTime: number;
		content?: string;
		imageUrl?: string | null;
	};
}) {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<EditArticleFormData>({
		resolver: zodResolver(editArticleSchema),
		defaultValues: {
			chapterId: chapterId,
			courseId: courseId,
			title: initialData.title,
			estimatedTime: initialData.estimatedTime.toString(),
			content: initialData.content ?? '',
			imageUrl: initialData.imageUrl ?? ''
		}
	});

	async function onSubmit(data: EditArticleFormData, isSaveAndExit: boolean) {
		try {
			const result = await saveArticleAction(data);
			if (!result.success) {
				throw new Error(result.message);
			}
			toast({
				title: 'Success',
				description: 'Article saved successfully'
			});
			if (isSaveAndExit) {
				router.push(`/admin/courses/edit/${courseId}`);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to save article',
				variant: 'destructive'
			});
		}
	}

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]"
				aria-label="Edit Article Form"
			>
				<div>
					<Card>
						<CardContent className="space-y-6 p-6">
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
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Content</FormLabel>
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
						</CardContent>
					</Card>
				</div>

				<div>
					<Card>
						<CardContent className="space-y-6 p-6">
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

							<FormField
								control={form.control}
								name="imageUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Featured Image</FormLabel>
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
														alt="Featured Image"
														width={100}
														height={100}
														className="h-28 w-28 rounded-md object-cover"
													/>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-wrap gap-2">
								<Button
									type="button"
									disabled={form.formState.isSubmitting}
									onClick={form.handleSubmit((data) => onSubmit(data, false))}
								>
									{form.formState.isSubmitting ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Save className="mr-2 h-4 w-4" />
									)}
									Save
								</Button>
								<Button
									type="button"
									disabled={form.formState.isSubmitting}
									onClick={form.handleSubmit((data) => onSubmit(data, true))}
								>
									{form.formState.isSubmitting ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Save className="mr-2 h-4 w-4" />
									)}
									Save & Exit
								</Button>
								<Button variant="outline" asChild>
									<Link href={`/admin/courses/edit/${courseId}`}>Cancel</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</form>
		</Form>
	);
}
