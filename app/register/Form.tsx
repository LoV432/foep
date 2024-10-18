'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import registerAction from './register_action.server';
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

export default function RegistrationForm() {
	const [formResponse, setFormResponse] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
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
			setIsLoading(true);
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
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
					disabled={isLoading}
					className="transition-all active:scale-95"
				>
					{isLoading ? 'Registering...' : 'Register'}
				</Button>
				{formResponse ? (
					<div
						className={`${formResponse.success ? 'text-primary' : 'text-destructive'} text-sm font-bold`}
					>
						{formResponse.message}
					</div>
				) : (
					<div className="text-sm font-bold opacity-0">
						This is just here to stop layout shift :p
					</div>
				)}
			</form>
		</Form>
	);
}
