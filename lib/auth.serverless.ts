// This file only exists to make these functions compatible with middleware.ts
// This is because middleware.ts runs on the serverless edge environment
// Some functions in auth.ts are not compatible with the serverless edge environment
// So we need to create a new set of functions that are compatible with middleware.ts
// The DB related functions and some crypto functions are the ones that are not compatible

import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { Token, SessionData } from './auth';
import ms from 'ms';

const key = new TextEncoder().encode(process.env.JWT_SECRET || '');
if (new TextDecoder().decode(key).length < 32) {
	throw new Error('JWT_SECRET must be atleast 32 characters long');
}
const SESSION_TIMEOUT = '1h';

export async function encrypt(payload: SessionData) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(SESSION_TIMEOUT)
		.sign(key);
}

export async function decrypt(input: string) {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ['HS256']
	});
	return payload as Token;
}

export async function refershSession(request: NextRequest) {
	const session = request.cookies.get('jwt-token')?.value;
	if (!session) return;

	let parsed;
	try {
		parsed = await decrypt(session);
	} catch {
		return;
	}
	parsed.exp = new Date(Date.now() + ms(SESSION_TIMEOUT)).getTime();
	const res = NextResponse.next();
	res.cookies.set({
		name: 'jwt-token',
		value: await encrypt(parsed),
		httpOnly: true,
		expires: parsed.exp
	});
	return res;
}
