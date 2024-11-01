'use client';

import { Button } from '@/components/ui/button';
import { moveToNextChapter } from './chapter-action';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function NextChapterButton({
	courseId,
	redirectUrl,
	buttonText,
	currentChapterOrder
}: {
	courseId: number;
	redirectUrl: string;
	buttonText: string;
	currentChapterOrder: number;
}) {
	const router = useRouter();
	const { toast } = useToast();
	async function handleClick() {
		try {
			const { success, movedChapter } = await moveToNextChapter(
				courseId,
				currentChapterOrder
			);
			if (!success) {
				throw new Error('Failed to move to next chapter');
			}
			if (movedChapter) {
				toast({
					title: 'Success',
					description: 'Chapter marked as completed',
					variant: 'default'
				});
			}
			router.push(redirectUrl);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Error moving to next chapter',
				variant: 'destructive'
			});
		}
	}
	return (
		<Button onClick={handleClick} className="ml-auto">
			{buttonText}
		</Button>
	);
}
