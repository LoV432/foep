'use server';

import { db } from '@/db/db';
import { Users, VerificationCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { VerificationEmail } from '../VerificationEmail';
import { Resend } from 'resend';
import { ResendVerificationSchema } from './ResendVerification.z';
import { ZodError } from 'zod';

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_DOMAIN) {
	throw new Error('RESEND_API_KEY and EMAIL_DOMAIN are not set');
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendVerificationEmail(email: string) {
	try {
		const { email: parsedEmail } = ResendVerificationSchema.parse({ email });
		const user = await db
			.select()
			.from(Users)
			.where(eq(Users.email, parsedEmail))
			.limit(1);
		// SELECT * FROM Users WHERE email = $1 LIMIT 1, [parsedEmail]

		if (user.length === 0) {
			throw new Error('User not found');
		}
		if (user[0].email_verified) {
			throw new Error('User already verified');
		}

		const verificationCode = crypto.randomBytes(32).toString('hex');

		await db.insert(VerificationCodes).values({
			code: verificationCode,
			user_id: user[0].user_id
		});
		// INSERT INTO VerificationCodes (code, user_id) VALUES ($1, $2), [verificationCode, user[0].user_id]

		const { data, error } = await resend.emails.send({
			from: `FOEP <foep@${process.env.EMAIL_DOMAIN}>`,
			to: [user[0].email],
			subject: 'Verify your email',
			react: VerificationEmail({
				name: user[0].name,
				email: user[0].email,
				code: verificationCode
			})
		});

		if (error) {
			console.log('Error in resendVerificationEmail:', error);
			throw new Error('Error sending email. Please try again.');
		}

		return {
			success: true as const,
			message: 'Verification email sent successfully'
		};
	} catch (error) {
		if (error instanceof Error) {
			// Should i really be sending the error message to the client?
			// I feel like sending the failed email message is enough
			if (
				error.message === 'User not found' ||
				error.message === 'User already verified' ||
				error.message === 'Error sending email. Please try again.'
			) {
				return { success: false as const, message: error.message };
			} else if (error instanceof ZodError) {
				return {
					success: false as const,
					message: 'Please enter a valid email address'
				};
			}
		} else {
			console.log('Error in resendVerificationEmail:', error);
		}

		return {
			success: false as const,
			message: 'An error occurred while sending the verification email'
		};
	}
}
