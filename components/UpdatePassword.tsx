'use client';

import { useState } from 'react';
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
import { updatePasswordAction } from '@/lib/update_profile_actions';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updatePasswordSchema } from '@/app/admin/profile/UpdateSchemas.z';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

export default function UpdatePasswordForm() {
	const [showPasswordField, setShowPasswordField] = useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof updatePasswordSchema>>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			newPassword: '',
			confirmPassword: ''
		}
	});

	async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
		try {
			const response = await updatePasswordAction(
				values.newPassword,
				values.confirmPassword
			);

			if (!response.success) throw new Error('Failed to update password');

			form.reset();
			setShowPasswordField(false);
			toast({
				title: 'Password updated successfully',
				description: 'Your password has been updated successfully'
			});
		} catch {
			toast({
				title: 'Error',
				description: 'Failed to update password',
				variant: 'destructive'
			});
		}
	}

	return (
		<div className="space-y-2">
			{!showPasswordField ? (
				<Button
					type="button"
					variant="outline"
					onClick={() => setShowPasswordField(true)}
				>
					Change Password
				</Button>
			) : (
				<Form {...form}>
					<form
						aria-label="Update Password form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} className="max-w-md" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} className="max-w-md" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex space-x-2">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<>
										Updating <Loader2 className="mr-2 h-4 w-4 animate-spin" />
									</>
								) : (
									'Update Password'
								)}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setShowPasswordField(false);
									form.reset();
								}}
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
