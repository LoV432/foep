import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { db } from '@/db/db';
import { Media } from '@/db/schema';
import { ALLOWED_FILE_TYPES } from '@/lib/allowed-uploads';

if (
	!process.env.B2_APPLICATION_KEY ||
	!process.env.B2_APPLICATION_KEY_ID ||
	!process.env.B2_BUCKET_NAME ||
	!process.env.B2_REGION ||
	!process.env.B2_ENDPOINT
) {
	throw new Error(
		`B2_APPLICATION_KEY, B2_APPLICATION_KEY_ID, B2_BUCKET_NAME, B2_REGION, and B2_ENDPOINT must be set`
	);
}

const ERROR_MESSAGES_CLIENT: Record<string, string> = {
	UNAUTHORIZED: 'Unauthorized',
	INVALID_FILE_TYPE: 'Invalid file type',
	NO_FILE_UPLOADED: 'No file uploaded'
};

const ERROR_MESSAGES_SERVER: Record<string, string> = {
	FAILED_TO_UPLOAD_TO_B2: 'Failed to upload file to B2',
	FAILED_TO_SAVE_METADATA_TO_DATABASE:
		'Failed to save file metadata to database',
	FAILED_TO_DELETE_FILE_FROM_B2_AFTER_FAILED_INSERT:
		'Failed to delete file from B2 after failed database insert'
};

const b2 = new S3Client({
	region: process.env.B2_REGION,
	endpoint: `https://${process.env.B2_ENDPOINT}`,
	credentials: {
		accessKeyId: process.env.B2_APPLICATION_KEY_ID,
		secretAccessKey: process.env.B2_APPLICATION_KEY
	}
});

export async function POST(request: NextRequest) {
	try {
		const session = await getSession();
		if (!session.success) {
			throw new Error('UNAUTHORIZED');
		}
		if (session.data.role !== 'instructor' && session.data.role !== 'admin') {
			throw new Error('UNAUTHORIZED');
		}

		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || typeof file !== 'object' || !(file instanceof File)) {
			throw new Error('NO_FILE_UPLOADED');
		}

		const fileType = file.type;
		if (!ALLOWED_FILE_TYPES.includes(fileType)) {
			throw new Error('INVALID_FILE_TYPE');
		}

		const fileName = `${session.data.id}-${Date.now()}-${file.name}`;

		const fileBuffer = await file.arrayBuffer();

		try {
			const command = new PutObjectCommand({
				Bucket: process.env.B2_BUCKET_NAME,
				Key: fileName,
				Body: Buffer.from(fileBuffer),
				ContentType: fileType
			});
			await b2.send(command);
		} catch (error) {
			console.log(`Failed to upload file ${fileName} to B2: ${error}`);
			throw new Error('FAILED_TO_UPLOAD_TO_B2');
		}
		try {
			await db.insert(Media).values({
				user_id: session.data.id,
				url: `https://${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}/${fileName}`,
				type: fileType
			});
		} catch (error) {
			try {
				const command = new DeleteObjectCommand({
					// This doesn't seem to work. The file still shows up on the B2 console.
					// TODO: Figure out why and fix it.
					Bucket: process.env.B2_BUCKET_NAME,
					Key: fileName
				});
				await b2.send(command);
			} catch (error) {
				// At this point idk what to do so just log it and move on
				console.log(
					`Failed to delete file ${fileName} from B2 after failed database insert: ${error}`
				);
				throw new Error('FAILED_TO_DELETE_FILE_FROM_B2_AFTER_FAILED_INSERT');
			}
			console.log(`Failed to save ${fileName} metadata to database: ${error}`);
			throw new Error('FAILED_TO_SAVE_METADATA_TO_DATABASE');
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			if (ERROR_MESSAGES_CLIENT[error.message]) {
				return NextResponse.json(
					{ error: ERROR_MESSAGES_CLIENT[error.message] },
					{ status: 400 }
				);
			}
			if (ERROR_MESSAGES_SERVER[error.message]) {
				return NextResponse.json(
					{ error: 'Something went wrong while uploading the file' },
					{ status: 500 }
				);
			}
		}
		console.log(`Something went wrong while uploading the file: ${error}`);
		return NextResponse.json(
			{ error: 'Something went wrong while uploading the file' },
			{ status: 500 }
		);
	}
}
