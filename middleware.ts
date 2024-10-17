import { NextRequest } from 'next/server';
import { refershSession } from '@/app/utils/auth';

export async function middleware(request: NextRequest) {
	return await refershSession(request);
}
