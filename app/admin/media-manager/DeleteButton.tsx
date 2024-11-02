'use client';

import { Button } from '@/components/ui/button';
import { deleteMediaAction } from './delete_media_action';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function DeleteButton({
	mediaId,
	friendlyName
}: {
	mediaId: number;
	friendlyName: string;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);
	async function handleDelete() {
		setIsDeleting(true);
		try {
			const deleteResult = await deleteMediaAction(mediaId);
			if (!deleteResult.success) {
				throw new Error(deleteResult.message);
			}
			toast({
				title: 'Success',
				description: 'Media deleted successfully'
			});
			router.refresh();
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				description: 'Failed to delete media',
				variant: 'destructive'
			});
		} finally {
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
			aria-label="Delete Media"
		>
			<Trash2 className="h-4 w-4" />
			<span className="sr-only">Delete {friendlyName}</span>
		</Button>
	);
}
