import { uploadFile, deleteFile } from '@/lib/media';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const uploadResult = await uploadFile(await request.formData());
	if (uploadResult.success) {
		return NextResponse.json(uploadResult, { status: 200 });
	} else {
		return NextResponse.json(uploadResult, { status: 400 });
	}
}

export async function DELETE(request: NextRequest) {
	const mediaId = request.nextUrl.searchParams.get('mediaId');
	if (!mediaId || isNaN(parseInt(mediaId))) {
		return NextResponse.json(
			{ message: 'Missing mediaId', success: false },
			{ status: 400 }
		);
	}
	const deleteResult = await deleteFile(parseInt(mediaId));
	if (deleteResult.success) {
		return NextResponse.json(deleteResult, { status: 200 });
	} else {
		return NextResponse.json(deleteResult, { status: 400 });
	}
}
