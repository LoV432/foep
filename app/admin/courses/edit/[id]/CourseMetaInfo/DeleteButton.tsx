'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { deleteCourseAction } from './delete_course_action';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function DeleteButton({ courseId }: { courseId: number }) {
	const { toast } = useToast();
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	async function handleDelete() {
		setIsDeleting(true);
		try {
			const deleteResult = await deleteCourseAction(courseId);
			if (!deleteResult.success) {
				throw new Error(deleteResult.message);
			}
			router.push('/admin/courses');
			toast({
				title: 'Success',
				description: 'Course deleted successfully'
			});
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				description: 'Failed to delete course'
			});
		} finally {
			setIsDeleting(false);
		}
	}
	return (
		<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
			{isDeleting ? (
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<Trash2 className="mr-2 h-4 w-4" />
			)}
			Delete
			<span className="sr-only">Delete This Course</span>
		</Button>
	);
}
