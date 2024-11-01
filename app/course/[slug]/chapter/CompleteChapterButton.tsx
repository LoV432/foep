'use client';

import { Button } from '@/components/ui/button';
import { markCourseComplete } from './chapter-action';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CompleteChapterButton({
	courseId,
	redirectUrl,
	buttonText
}: {
	courseId: number;
	redirectUrl: string;
	buttonText: string;
}) {
	const router = useRouter();
	const { toast } = useToast();
	async function handleClick() {
		try {
			const { success } = await markCourseComplete(courseId);
			if (!success) {
				throw new Error('Failed to mark course complete');
			}
			toast({
				title: 'Success',
				description: '🎉🎉You have completed the course🎉🎉',
				variant: 'default'
			});
			router.push(redirectUrl);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Error marking course complete',
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
