'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import registerAction from './register_action';
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
import { registerFormSchema } from './FormSchema.z';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegistrationForm() {
	const [formResponse, setFormResponse] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	});

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		try {
			setFormResponse(null);
			const result = await registerAction({ fields: values });
			setFormResponse(result);
			if (result.success) {
				form.reset();
			}
		} catch {
			setFormResponse({
				success: false,
				message: 'Something went wrong. Please try again'
			});
		}
	}
	return (
		<Form {...form}>
			<form
				method="POST"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-5"
				aria-label="Registration Form"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder="Chloe Walker" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
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
							Registering <Loader2 className="mr-2 h-4 w-4 animate-spin" />
						</>
					) : (
						'Register'
					)}
				</Button>
				{formResponse && (
					<div
						className={`${formResponse.success ? 'text-primary' : 'text-destructive'} text-sm`}
					>
						{formResponse.message}
						{formResponse.success && (
							<div className="text-foreground/60 underline underline-offset-2 hover:text-foreground">
								<Link href="/register/resend-verification">
									Resend verification email
								</Link>
							</div>
						)}
					</div>
				)}
				<div className="flex justify-end">
					<Link
						href="/login"
						className="text-sm text-black/70 underline hover:text-black"
					>
						Already have an account?
					</Link>
				</div>
			</form>
		</Form>
	);
}
