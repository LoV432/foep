'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useForm } from 'react-hook-form';
import { createCategoryAction } from './create_category_action';
import { useToast } from '@/hooks/use-toast';
import { createCategorySchema } from './CreateCategorySchema.z';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function AddCategory() {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<z.infer<typeof createCategorySchema>>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: ''
		}
	});

	async function onSubmit(data: z.infer<typeof createCategorySchema>) {
		try {
			const result = await createCategoryAction(data);
			if (!result.success) {
				throw new Error(result.message);
			}
			toast({
				title: 'Success',
				description: 'Category created successfully'
			});
			form.reset();
			router.refresh();
		} catch {
			toast({
				title: 'Error',
				description: 'Failed to create category',
				variant: 'destructive'
			});
		}
	}

	return (
		<Card className="container mx-auto mb-6 max-w-4xl">
			<CardHeader>
				<CardTitle>Add New Category</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="contents"
						method="POST"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter category name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="w-full"
							>
								{form.formState.isSubmitting ? (
									<>
										Creating <Loader2 className="mr-2 h-4 w-4 animate-spin" />
									</>
								) : (
									'Create Category'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
