'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import ms from 'ms';

type SessionData = {
	username: string;
};

export type Token = SessionData & { exp: number; iat: number };

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

export async function generateSession() {
	const token = await encrypt({ username: 'Jack' });
	const expires = new Date(Date.now() + ms(SESSION_TIMEOUT)).getTime();
	cookies().set('jwt-token', token, {
		expires,
		httpOnly: true
	});
}

export async function getSession() {
	try {
		const token = cookies().get('jwt-token')?.value;
		if (!token) {
			throw new Error('No JWT cookie Found!');
		}
		const verifiedToken = await decrypt(token);
		return {
			isValid: true as const,
			data: verifiedToken
		};
	} catch (e) {
		// console.log(e);
		return {
			isValid: false as const
		};
	}
}

export async function destroySession() {
	cookies().delete('jwt-token');
}

export async function refershSession(request: NextRequest) {
	const session = request.cookies.get('jwt-token')?.value;
	if (!session) return;

	let parsed;
	try {
		parsed = await decrypt(session);
	} catch (e) {
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
