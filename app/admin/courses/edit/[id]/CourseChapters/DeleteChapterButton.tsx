'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteChapterAction } from './chapter_actions';

export function DeleteChapterButton({
	chapterId,
	onChapterDeleted
}: {
	chapterId: number;
	onChapterDeleted: (chapterId: number) => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { toast } = useToast();

	async function handleDelete() {
		setIsDeleting(true);
		try {
			const result = await deleteChapterAction(chapterId);
			if (!result.success) {
				throw new Error(result.message);
			}
			toast({
				title: 'Success',
				description: 'Chapter deleted successfully'
			});
			onChapterDeleted(chapterId);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to delete chapter',
				variant: 'destructive'
			});
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Button
			variant="outline"
			size="sm"
			className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
			onClick={handleDelete}
			disabled={isDeleting}
			aria-label="Delete Chapter"
		>
			{isDeleting ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Trash2 className="h-4 w-4" />
			)}
		</Button>
	);
}
