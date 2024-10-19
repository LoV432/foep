'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResetPasswordSchema } from './ResetPassword.z';
import { resetPasswordAction } from './reset_password_action';
import { useState } from 'react';
import Link from 'next/link';

export function ResetPasswordForm({ code }: { code: string }) {
	const [isLoading, setIsLoading] = useState(false);
	const [formResponse, setFormResponse] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: ''
		}
	});

	const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
		setIsLoading(true);
		try {
			const response = await resetPasswordAction({
				code: code,
				values: values
			});
			setFormResponse(response);
			form.reset();
		} catch (error) {
			setFormResponse({
				success: false,
				message: 'Something went wrong, please try again'
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				method="POST"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-5"
			>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input placeholder="••••••••" type="password" {...field} />
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
								<Input placeholder="••••••••" type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Resetting Password...' : 'Reset Password'}
				</Button>
				<div className="pb-4">
					{formResponse && (
						<p
							className={`text-center ${
								formResponse.success ? 'text-primary' : 'text-destructive'
							}`}
						>
							{formResponse.message === 'Invalid reset code' ? (
								<div>
									{formResponse.message}.{' '}
									<Link href="/login/reset-password" className="underline">
										Get a new reset code
									</Link>
								</div>
							) : (
								formResponse.message
							)}
						</p>
					)}
				</div>
			</form>
		</Form>
	);
}
