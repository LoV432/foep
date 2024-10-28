'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Users } from '@/db/schema';
import { userEditSchema } from './EditUserSchema.z';
import { editUserAction } from './edit-user-action';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import Link from 'next/link';

export function UserEditForm({ user }: { user: typeof Users.$inferSelect }) {
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof userEditSchema>>({
		resolver: zodResolver(userEditSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
			role: user.role,
			email_verified: user.email_verified
		}
	});

	async function onSubmit(
		data: z.infer<typeof userEditSchema>,
		saveAndExit: boolean
	) {
		try {
			const result = await editUserAction(user.user_id, data);
			if (!result.success) {
				throw new Error(result.error);
			}
			toast({
				title: 'User updated successfully',
				description: 'User has been updated successfully'
			});
			if (saveAndExit) {
				router.push('/admin/users');
			}
		} catch (error) {
			toast({
				title: 'Failed to update user',
				description: 'Failed to update user',
				variant: 'destructive'
			});
			console.error(error);
		}
	}

	return (
		<Form {...form}>
			<form className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
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
								<Input {...field} type="email" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="instructor">Instructor</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email_verified"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Email verified</FormLabel>
							</div>
						</FormItem>
					)}
				/>

				<div className="flex gap-4">
					<Button
						type="button"
						disabled={form.formState.isSubmitting}
						onClick={() => onSubmit(form.getValues(), false)}
					>
						{form.formState.isSubmitting ? 'Updating...' : 'Update User'}
					</Button>
					<Button
						type="button"
						disabled={form.formState.isSubmitting}
						onClick={() => onSubmit(form.getValues(), true)}
					>
						{form.formState.isSubmitting ? 'Updating...' : 'Save and Exit'}
					</Button>
					<Button type="button" variant="outline" className="p-0" asChild>
						<Link
							className="flex h-full w-full items-center justify-center p-4"
							href="/admin/users"
						>
							Cancel
						</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
}
