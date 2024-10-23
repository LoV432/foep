'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { ALLOWED_FILE_TYPES } from '@/lib/allowed-uploads';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { uploadFormSchema } from './UploadForm.z';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export default function UploadForm() {
	const [previewUrl, setPreviewUrl] = useState<string>();
	const form = useForm<z.infer<typeof uploadFormSchema>>({
		resolver: zodResolver(uploadFormSchema),
		defaultValues: {
			file: undefined,
			alt_text: '',
			friendly_name: ''
		}
	});
	async function handleFileChange(
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) {
		if (e.target.files?.[0]) {
			setPreviewUrl(URL.createObjectURL(e.target.files[0]));
		}
		onChange(e);
	}

	async function onSubmit(values: z.infer<typeof uploadFormSchema>) {
		console.log(values);
	}

	return (
		<div className="flex flex-col items-center">
			<Form {...form}>
				<form
					method="POST"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="file"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<>
										<Label htmlFor="file-upload" className="cursor-pointer">
											<div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
												{previewUrl ? (
													<img
														src={previewUrl}
														alt="file preview"
														onError={(e) => {
															e.currentTarget.alt = 'file preview unavailable';
														}}
														className="mx-auto max-h-48 max-w-full"
													/>
												) : (
													<>
														<Upload className="mx-auto h-12 w-12 text-gray-400" />
														<p className="mt-2 text-sm text-gray-600">
															Click here to upload media
														</p>
													</>
												)}
											</div>
										</Label>
										<Input
											id="file-upload"
											type="file"
											className="hidden"
											accept={ALLOWED_FILE_TYPES.join(',')}
											{...field}
											// This feels like an awful hack. Find a better way to do this.
											onChange={(e) => handleFileChange(e, field.onChange)}
										/>
									</>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{previewUrl && (
						<>
							<FormField
								control={form.control}
								name="friendly_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>File name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="alt_text"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Alt text</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="mt-4">
								Upload
							</Button>
						</>
					)}
				</form>
			</Form>
		</div>
	);
}
