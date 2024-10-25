'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DeleteMedia({
	mediaId,
	refetchMedia
}: {
	mediaId: number;
	refetchMedia: () => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	async function deleteMedia(mediaId: number) {
		setIsLoading(true);
		try {
			const deleteResult = await fetch(`/api/media?mediaId=${mediaId}`, {
				method: 'DELETE'
			});
			if (deleteResult.ok) {
				refetchMedia();
			} else {
				console.log(`Failed to delete media: ${deleteResult.statusText}`);
			}
		} catch (error) {
			console.log(`Failed to delete media: ${error}`);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<Button
			variant="destructive"
			onClick={() => deleteMedia(mediaId)}
			disabled={isLoading}
		>
			{isLoading ? 'Deleting...' : 'Delete'}
		</Button>
	);
}
