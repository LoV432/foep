'use server';

import { cookies } from 'next/headers';
import ms from 'ms';
import { loginFormSchema } from '@/app/login/FormSchema.z';
import { z } from 'zod';
import { db } from '@/db/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { decrypt, encrypt } from './auth.serverless';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

export type SessionData = {
	name: string;
	id: number;
};

export type Token = SessionData & { exp: number; iat: number };

const key = new TextEncoder().encode(process.env.JWT_SECRET || '');
if (new TextDecoder().decode(key).length < 32) {
	throw new Error('JWT_SECRET must be atleast 32 characters long');
}
const SESSION_TIMEOUT = '1h';

export async function login({
	values,
	redirectTo
}: {
	values: z.infer<typeof loginFormSchema>;
	redirectTo?: string;
}) {
	try {
		const { email, password } = loginFormSchema.parse(values);
		const user = await db.select().from(Users).where(eq(Users.email, email));
		// SELECT * FROM Users WHERE email = $1, [email]
		if (user.length === 0) {
			throw new Error('User not found');
		}

		const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
		if (!isPasswordCorrect) {
			throw new Error('Incorrect password');
		}

		if (!user[0].email_verified) {
			throw new Error('Email not verified');
		}

		const token = await encrypt({ name: user[0].name, id: user[0].user_id });
		const expires = new Date(Date.now() + ms(SESSION_TIMEOUT)).getTime();
		cookies().set('jwt-token', token, {
			expires,
			httpOnly: true
		});
	} catch (e) {
		if (e instanceof Error) {
			if (e.message === 'Email not verified') {
				return {
					success: false as const,
					message: e.message
				};
			}
		}
		console.log(e);
		return {
			success: false as const,
			message:
				'Something went wrong. Please double check your credentials and try again.'
		};
	}
	if (redirectTo) {
		redirect(redirectTo);

		// This return is never reached its here just to tell typescript that its possible to return void
		// This ensures i handle the void return whenever redirect is called
		return;
	}
	return {
		success: true as const,
		message: 'Login successful'
	};
}

export async function getSession() {
	try {
		const token = cookies().get('jwt-token')?.value;
		if (!token) {
			throw new Error('No JWT cookie Found!');
		}
		const verifiedToken = await decrypt(token);
		return {
			success: true as const,
			data: verifiedToken
		};
	} catch (e) {
		// console.log(e);
		return {
			success: false as const
		};
	}
}

export async function destroySession() {
	cookies().delete('jwt-token');
}
