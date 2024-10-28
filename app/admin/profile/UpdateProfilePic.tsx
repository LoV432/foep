'use client';

import UploadDialog from '@/components/UploadDialog/UploadDialog';
import { updateProfilePicAction } from './update_profile_actions';
import { Media } from '@/db/schema';
import { useToast } from '@/hooks/use-toast';

export default function UpdateProfilePic({ userId }: { userId: number }) {
	const { toast } = useToast();
	async function handleUpdateProfilePic(media: typeof Media.$inferSelect) {
		try {
			const response = await updateProfilePicAction(userId, media.url);
			if (!response.success) {
				throw new Error('Failed to update profile picture');
			}
			toast({
				title: 'Profile picture updated successfully',
				description: 'Your profile picture has been updated successfully'
			});
		} catch {
			toast({
				title: 'Error',
				description: 'Failed to update profile picture',
				variant: 'destructive'
			});
		}
	}
	return (
		<UploadDialog
			className="mx-auto mt-4"
			selectedMediaCallback={handleUpdateProfilePic}
			placeholder="Update Picture"
		/>
	);
}
