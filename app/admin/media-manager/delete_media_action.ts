'use server';

import { deleteFile } from '@/lib/media';

export async function deleteMediaAction(mediaId: number) {
	const deleteResult = await deleteFile(mediaId);
	if (deleteResult.success) {
		return { success: true as const };
	} else {
		return { success: false as const, message: deleteResult.message };
	}
}
