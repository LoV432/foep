'use client';

import { Button } from '@/components/ui/button';
import { deleteMedia } from './DeleteAction';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({
	mediaId,
	friendlyName
}: {
	mediaId: number;
	friendlyName: string;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	async function handleDelete() {
		try {
			setIsDeleting(true);
			const deleteResult = await deleteMedia(mediaId);
			if (deleteResult.success) {
				router.refresh();
			} else {
				throw new Error(deleteResult.message);
			}
		} catch (error) {
			console.error(error);
			setError('Failed to delete media');
			setIsDeleting(false);
		}
	}
	return (
		<Button
			onClick={handleDelete}
			disabled={isDeleting}
			variant="destructive"
			size="icon"
			className="h-12 w-12 p-0"
		>
			<Trash2 className="h-4 w-4" />
			<span className="sr-only">Delete {friendlyName}</span>
		</Button>
	);
}
