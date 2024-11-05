'use client';

import { Button } from '@/components/ui/button';
import { deleteUserAction } from './delete_user_action';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { TrashIcon } from 'lucide-react';

export function DeleteUserButton({ userId }: { userId: number }) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	async function handleDelete() {
		try {
			const result = await deleteUserAction(userId);
			if (!result.success) {
				throw new Error(result.message);
			}
			toast({
				title: 'User deleted',
				description: `User deleted successfully`,
				variant: 'default'
			});
			router.refresh();
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'An error occurred',
				variant: 'destructive'
			});
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<Button
			variant="destructive"
			size="icon"
			className="h-12 w-12 p-0"
			onClick={handleDelete}
			disabled={isLoading}
		>
			{/* TODO: Add warning as this will nuke all courses and reviews of this user */}
			<TrashIcon className="h-4 w-4" />
			<span className="sr-only">Delete {userId}</span>
		</Button>
	);
}
