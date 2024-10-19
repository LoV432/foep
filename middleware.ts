import { NextRequest } from 'next/server';
import { refershSession } from '@/lib/auth.serverless';

export async function middleware(request: NextRequest) {
	return await refershSession(request);
}
