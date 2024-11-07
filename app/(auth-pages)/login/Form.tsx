'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { loginFormSchema } from './FormSchema.z';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
	const [formResponse, setFormResponse] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		try {
			setFormResponse(null);
			const result = await login({ values, redirectTo: '/dashboard' });
			if (!result) {
				// This means the login was successful and user is being redirected
				toast({
					title: 'Success',
					description: 'You are now logged in',
					variant: 'default'
				});
				return;
			}
			if (!result.success) {
				throw new Error(result.message);
			}
			setFormResponse(result);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Something went wrong. Please try again',
				variant: 'destructive'
			});
			setFormResponse({
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Something went wrong. Please try again'
			});
		}
	}
	return (
		<Form {...form}>
			<form
				method="POST"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-5"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Chloe@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="••••••••" {...field} />
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
							Logging in <Loader2 className="mr-2 h-4 w-4 animate-spin" />
						</>
					) : (
						'Login'
					)}
				</Button>
				{formResponse && (
					<div
						className={`text-sm ${
							formResponse.success ? 'text-primary' : 'text-destructive'
						}`}
					>
						{formResponse.message === 'Email not verified' ? (
							<>
								{formResponse.message}.{' '}
								<Link
									href="/register/resend-verification"
									className="text-black/70 underline hover:text-black"
								>
									Resend verification email
								</Link>
							</>
						) : (
							formResponse.message
						)}
					</div>
				)}
				<div className="flex flex-col items-end gap-2 sm:flex-row">
					<Link
						href="/register"
						className="text-sm text-black/70 underline hover:text-black sm:mr-auto"
					>
						Don&apos;t have an account?
					</Link>
					<Link
						href="/login/reset-password"
						className="text-sm text-black/70 underline hover:text-black sm:ml-auto"
					>
						Forgot your password?
					</Link>
				</div>
			</form>
		</Form>
	);
}
