'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { deleteCourseAction } from './delete_course';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ courseId }: { courseId: number }) {
	const [isDeleting, setIsDeleting] = useState(false);
	const router = useRouter();
	async function handleDelete() {
		try {
			setIsDeleting(true);
			const deleteResult = await deleteCourseAction(courseId);
			if (deleteResult.success) {
				router.push('/admin/courses');
			} else {
				throw new Error(deleteResult.message);
			}
		} catch (error) {
			console.error(error);
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
		</Button>
	);
}
