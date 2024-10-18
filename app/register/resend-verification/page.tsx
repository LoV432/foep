'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ResendVerificationSchema } from './ResendVerification.z';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { resendVerificationEmail } from './resend_email_action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';

export default function ResendVerification() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const form = useForm<z.infer<typeof ResendVerificationSchema>>({
		resolver: zodResolver(ResendVerificationSchema),
		defaultValues: {
			email: ''
		}
	});
	const onSubmit = async (values: z.infer<typeof ResendVerificationSchema>) => {
		if (success !== null) {
			return;
		}
		setIsLoading(true);
		try {
			const result = await resendVerificationEmail(values.email);
			if (result.success) {
				setError(null);
				setSuccess(result.message);
			} else {
				setSuccess(null);
				setError(result.message);
			}
			form.reset();
		} catch (error) {
			setError('An error occurred while sending the verification email');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-secondary">
			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
				<div className="absolute bottom-[30%] right-[15%] h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
			</div>
			<Card className="z-10 w-full max-w-md shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
						<Mail className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold text-primary">
						Resend Verification Email
					</CardTitle>
				</CardHeader>
				<CardContent>
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
											<Input placeholder="chloe@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || success !== null}
							>
								{isLoading ? 'Sending...' : 'Resend Verification Email'}
							</Button>
						</form>
					</Form>
				</CardContent>

				<div className="pb-4">
					{error && (
						<p className="text-center font-bold text-destructive">{error}</p>
					)}
					{success && (
						<p className="text-center font-bold text-primary">{success}</p>
					)}
				</div>
			</Card>
		</div>
	);
}
