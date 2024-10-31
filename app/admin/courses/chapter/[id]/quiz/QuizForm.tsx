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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { editQuizMetadataSchema, EditQuizMetadataFormData } from './EditQuiz.z';
import { deleteQuizAction, saveQuizMetadataAction } from './quiz_actions';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getQuizAction, createEmptyQuizAction } from './quiz_actions';
import { QuizQuestions } from '@/db/schema';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import QuestionForm from './QuestionForm';
import { Badge } from '@/components/ui/badge';

export default function QuizForm({
	chapterData
}: {
	chapterData: {
		course_id: number;
		course_chapter_id: number;
		title: string;
		estimated_time: number;
	};
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [allPendingChanges, setAllPendingChanges] = useState<
		Record<number, boolean>
	>({});
	const blockSave = useMemo(
		() => Object.values(allPendingChanges).some((value) => value),
		[allPendingChanges]
	);

	useEffect(() => {
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			if (blockSave) {
				e.preventDefault();
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [blockSave]);

	const {
		data: quizQuestions,
		refetch,
		isLoading
	} = useQuery({
		queryKey: ['quizQuestions', chapterData.course_chapter_id],
		queryFn: async () => {
			const result = await getQuizAction({
				chapterId: chapterData.course_chapter_id
			});
			if (!result.success) {
				throw new Error(result.message);
			}
			return result.quizQuestions;
		}
	});

	const form = useForm<EditQuizMetadataFormData>({
		resolver: zodResolver(editQuizMetadataSchema),
		defaultValues: {
			chapterId: chapterData.course_chapter_id,
			courseId: chapterData.course_id,
			title: chapterData.title,
			estimatedTime: chapterData.estimated_time.toString()
		}
	});

	async function onSubmit(
		data: EditQuizMetadataFormData,
		isSaveAndExit: boolean
	) {
		try {
			const result = await saveQuizMetadataAction(data);
			if (!result.success) {
				throw new Error(result.message);
			}
			toast({
				title: 'Success',
				description: 'Article saved successfully'
			});
			if (isSaveAndExit) {
				if (
					!blockSave ||
					(blockSave &&
						window.confirm(
							'You have unsaved changes in the quiz questions. Are you sure you want to leave?'
						))
				) {
					router.push(`/admin/courses/edit/${chapterData.course_id}`);
				}
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
		<div className="grid grid-rows-1 gap-8 lg:grid-cols-[2fr_1fr]">
			<Form {...form}>
				<form className="contents">
					<div className="space-y-4">
						<Card className="h-full">
							<CardContent className="space-y-6 p-6">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quiz Title</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Enter quiz title" />
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
									<Button
										variant="outline"
										onClick={(e) => {
											if (
												blockSave &&
												!window.confirm(
													'You have unsaved changes in the quiz questions. Are you sure you want to leave?'
												)
											) {
												e.preventDefault();
												return;
											}
										}}
										asChild
									>
										<Link href={`/admin/courses/edit/${chapterData.course_id}`}>
											Cancel
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</form>
			</Form>
			<Card>
				<CardContent className="space-y-6 p-6">
					<h2 className="text-lg font-bold">Questions</h2>
					<div className="space-y-4">
						{isLoading && (
							<div className="flex h-20 items-center justify-center">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
						)}
						<Accordion type="multiple">
							{quizQuestions?.map((question, index) => (
								<Question
									refetch={refetch as unknown as () => Promise<void>}
									key={`question-${question.quiz_question_id}`}
									question={question}
									order={index}
									setAllPendingChanges={setAllPendingChanges}
								/>
							))}
						</Accordion>
					</div>
					<AddQuestionButton
						chapterId={chapterData.course_chapter_id}
						// :D
						refetch={refetch as unknown as () => Promise<void>}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

function AddQuestionButton({
	chapterId,
	refetch
}: {
	chapterId: number;
	refetch: () => Promise<void>;
}) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	async function createEmptyQuiz() {
		setIsLoading(true);
		try {
			const result = await createEmptyQuizAction({ chapterId });
			if (!result.success) {
				throw new Error(result.message);
			}
			await refetch();
			toast({
				title: 'Success',
				description: 'Empty quiz created successfully'
			});
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to create empty quiz',
				variant: 'destructive'
			});
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<Button type="button" onClick={createEmptyQuiz} disabled={isLoading}>
			{isLoading ? (
				<>
					Adding <Loader2 className="mr-2 h-4 w-4 animate-spin" />
				</>
			) : (
				'Add Question'
			)}
		</Button>
	);
}

function Question({
	question,
	order,
	refetch,
	setAllPendingChanges
}: {
	question: typeof QuizQuestions.$inferSelect;
	order: number;
	refetch: () => Promise<void>;
	setAllPendingChanges: Dispatch<SetStateAction<Record<number, boolean>>>;
}) {
	const { toast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isFormChanged, setIsFormChanged] = useState(false);
	async function deleteQuestion() {
		if (isDeleting) return;
		setIsDeleting(true);
		try {
			const result = await deleteQuizAction({
				quizQuestionId: question.quiz_question_id
			});
			if (!result.success) {
				throw new Error(result.message);
			}
			await refetch();
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to delete question',
				variant: 'destructive'
			});
		} finally {
			setIsDeleting(false);
		}
	}

	useEffect(() => {
		setAllPendingChanges((prev) => ({
			...prev,
			[question.quiz_question_id]: isFormChanged
		}));

		return () => {
			setAllPendingChanges((prev) => ({
				...prev,
				[question.quiz_question_id]: false
			}));
		};
	}, [isFormChanged]);

	return (
		<AccordionItem
			value={`question-${order}`}
			className="m-2 rounded-md border border-border px-4"
		>
			<div
				className={`group ${isDeleting ? 'pointer-events-none opacity-50' : ''}`}
			>
				<AccordionTrigger>
					<div className="flex w-[calc(100%-2rem)] items-center gap-2">
						<span className="group-hover:underline">Question {order + 1}</span>
						<div
							className="active:bg-zinc-30 hidden h-6 w-6 place-items-center justify-center rounded hover:bg-zinc-200 active:scale-95 group-hover:inline-flex"
							onClick={(e) => {
								e.stopPropagation();
								deleteQuestion();
							}}
						>
							<Trash2 className="h-4 w-4" />
						</div>
						{isFormChanged && (
							<Badge
								variant="destructive"
								className="!hover:no-underline ml-auto !no-underline"
							>
								Unsaved Changes
							</Badge>
						)}
					</div>
				</AccordionTrigger>
				<AccordionContent className="space-y-4 border-b border-border px-2 pb-12 pt-2">
					<QuestionForm
						question={question}
						refetch={refetch}
						isFormChanged={isFormChanged}
						setIsFormChanged={setIsFormChanged}
					/>
				</AccordionContent>
			</div>
		</AccordionItem>
	);
}
