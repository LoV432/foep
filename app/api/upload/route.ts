import { uploadFile } from '@/lib/upload';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const uploadResult = await uploadFile(await request.formData());
	if (uploadResult.success) {
		return NextResponse.json(uploadResult, { status: 200 });
	} else {
		return NextResponse.json(uploadResult, { status: 400 });
	}
}
