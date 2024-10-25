'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { ALLOWED_FILE_TYPES } from '@/lib/allowed-uploads';
import Image from 'next/image';
import { Media } from '@/db/schema';

export default function UploadForm({
	selectedMediaCallback,
	closeDialog
}: {
	selectedMediaCallback?: (media: typeof Media.$inferSelect) => void;
	closeDialog?: () => void;
}) {
	const [previewUrl, setPreviewUrl] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();

	const fileRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files?.[0]) {
			setPreviewUrl(URL.createObjectURL(e.target.files[0]));
		}
	}

	async function onSubmit(formData: FormData) {
		try {
			const file = formData.get('file');
			if (!file || !(file instanceof File)) {
				throw new Error('No file uploaded');
			}
			if (file.size > 100000000) {
				throw new Error('This file is too large (max 100MB)');
			}
			if (!ALLOWED_FILE_TYPES.includes(file.type)) {
				throw new Error('This file type is not allowed');
			}
			setIsLoading(true);
			setError(undefined);
			const uploadResult = await fetch('/api/media', {
				method: 'POST',
				body: formData
			});
			if (uploadResult.ok) {
				const media = (await uploadResult.json())
					.message as typeof Media.$inferSelect;
				selectedMediaCallback?.(media);
				previewUrl && URL.revokeObjectURL(previewUrl);
				setPreviewUrl(undefined);
				formRef.current?.reset();
				closeDialog?.();
			} else {
				const errorData = (await uploadResult.json()) as { message: string };
				setError(errorData.message);
			}
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				console.error(error);
				setError('An error occurred while uploading the file');
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex flex-col items-center">
			<form
				method="POST"
				ref={formRef}
				onSubmit={(e) => {
					e.preventDefault();
					onSubmit(new FormData(e.currentTarget));
				}}
				className="w-full max-w-lg space-y-4"
			>
				<>
					<Label htmlFor="file-upload" className="cursor-pointer">
						<div className="mx-auto flex h-48 w-48 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
							{previewUrl ? (
								<Image
									src={previewUrl}
									alt="file preview"
									onError={(e) => {
										e.currentTarget.alt = `${fileRef.current?.files?.[0]?.name.slice(0, 10)}.... preview unavailable`;
									}}
									width={192}
									height={192}
									className="grid place-items-center text-center"
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
						onChange={(e) => handleFileChange(e)}
						ref={fileRef}
						name="file"
					/>
				</>
				{previewUrl && (
					<>
						<div className="space-y-2 px-2">
							<Label htmlFor="friendly_name" className="text-sm font-semibold">
								File name
							</Label>
							<Input id="friendly_name" name="friendly_name" type="text" />
						</div>
						<div className="space-y-2 px-2">
							<Label htmlFor="alt_text" className="text-sm font-semibold">
								Alt text
							</Label>
							<Input id="alt_text" name="alt_text" type="text" />
						</div>
						<div className="flex justify-end space-y-2 px-2">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Uploading...' : 'Upload'}
							</Button>
						</div>
					</>
				)}
				{error && <p className="text-red-500">{error}</p>}
			</form>
		</div>
	);
}
