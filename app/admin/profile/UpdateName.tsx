'use client';

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
import { useToast } from '@/hooks/use-toast';
import { updateProfileNameAction } from './update_profile_actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateProfileNameSchema } from './UpdateSchemas.z';
import { z } from 'zod';

export default function UpdateProfileForm({
	userId,
	initialName
}: {
	userId: number;
	initialName: string;
}) {
	const { toast } = useToast();

	const form = useForm<z.infer<typeof updateProfileNameSchema>>({
		resolver: zodResolver(updateProfileNameSchema),
		defaultValues: {
			userId,
			name: initialName
		}
	});

	async function onSubmit(values: z.infer<typeof updateProfileNameSchema>) {
		try {
			const response = await updateProfileNameAction(userId, values.name);

			if (!response.success) throw new Error('Failed to update profile');

			toast({
				title: 'Profile updated successfully',
				description: 'Your profile has been updated successfully'
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update profile',
				variant: 'destructive'
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<div className="flex max-w-md space-x-2">
								<div className="flex flex-col space-y-2">
									<FormControl>
										<Input {...field} className="flex-1" />
									</FormControl>
									<FormMessage />
								</div>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									Update Name
								</Button>
							</div>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
