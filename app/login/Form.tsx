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

export default function LoginForm() {
	const [formResponse, setFormResponse] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
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
			setIsLoading(true);
			const result = await login({ values, redirectTo: '/' });
			if (result && !result.success) {
				setFormResponse(result);
			}
		} catch {
			setFormResponse({
				success: false,
				message: 'Something went wrong. Please try again'
			});
		} finally {
			setIsLoading(false);
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
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Logging in...' : 'Login'}
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
			</form>
		</Form>
	);
}
