import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Plus, RefreshCcw } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { QuizQuestions } from '@/db/schema';
import { useForm, useFieldArray } from 'react-hook-form';
import { EditQuizFormData } from './EditQuiz.z';
import { editQuizSchema } from './EditQuiz.z';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { saveQuizAction } from './quiz_actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function QuestionForm({
	question,
	refetch,
	setIsFormChanged,
	isFormChanged
}: {
	question: typeof QuizQuestions.$inferSelect;
	refetch: () => Promise<void>;
	setIsFormChanged: (value: boolean) => void;
	isFormChanged: boolean;
}) {
	const { toast } = useToast();
	const form = useForm<EditQuizFormData>({
		resolver: zodResolver(editQuizSchema),
		defaultValues: {
			quiz_question_id: question.quiz_question_id,
			question: question.question,
			options: question.options,
			correct_option_id: question.correct_option_id
		}
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'options'
	});

	async function onSubmit(data: EditQuizFormData) {
		try {
			const response = await saveQuizAction(data);
			if (!response.success) {
				throw new Error('Failed to save quiz question');
			}
			await refetch();
			toast({
				title: 'Quiz question saved successfully',
				description: 'Your changes have been saved.'
			});
			form.reset(data);
		} catch {
			toast({
				title: 'Failed to save quiz question',
				description: 'Please try again.',
				variant: 'destructive'
			});
		}
	}

	useEffect(() => {
		// TODO: Find a better way to do this
		// I am sure there are probably less expensive ways to do this
		// But for now this is good enough
		const defaultString = JSON.stringify(form.formState.defaultValues);
		const currentString = JSON.stringify(form.watch());
		setIsFormChanged(defaultString !== currentString);
	}, [form.watch()]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				method="POST"
			>
				<FormField
					control={form.control}
					name="question"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Question</FormLabel>
							<FormControl>
								<Textarea placeholder="Enter question" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-4">
					<div>Options ({fields.length})</div>
					{fields.length < 2 && (
						<p className="text-sm text-red-500">
							At least 2 options are required
						</p>
					)}
					<FormField
						control={form.control}
						name="correct_option_id"
						render={({ field }) => (
							<RadioGroup value={field.value.toString()}>
								{fields.map((field, index) => (
									<FormField
										key={field.id}
										control={form.control}
										name={`options.${index}.text`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="flex items-center gap-2">
														<RadioGroupItem
															value={index.toString()}
															onClick={() => {
																form.setValue('correct_option_id', index);
															}}
														/>
														<Input
															placeholder={`Option ${index + 1}`}
															{...field}
														/>
														<Button
															type="button"
															variant="outline"
															size="icon"
															onClick={() => remove(index)}
														>
															<Trash2 />
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}
							</RadioGroup>
						)}
					/>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => {
								append({ text: '' });
							}}
						>
							<Plus />
							<span className="sr-only">Add Option</span>
						</Button>
						<div className="ml-auto flex items-center gap-2">
							{isFormChanged && (
								<Button
									variant="outline"
									type="button"
									onClick={() => form.reset()}
								>
									Reset <RefreshCcw />
								</Button>
							)}
							<Button disabled={form.formState.isSubmitting} type="submit">
								{form.formState.isSubmitting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									'Save'
								)}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
