import { NextRequest } from 'next/server';
import { refershSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
	return await refershSession(request);
}
