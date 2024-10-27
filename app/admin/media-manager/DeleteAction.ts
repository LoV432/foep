'use server';

import { deleteFile } from '@/lib/media';

export async function deleteMedia(mediaId: number) {
	const deleteResult = await deleteFile(mediaId);
	if (deleteResult.success) {
		return { success: true };
	} else {
		return { success: false, message: deleteResult.message };
	}
}
