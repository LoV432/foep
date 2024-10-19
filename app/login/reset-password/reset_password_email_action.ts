'use server';

import { db } from '@/db/db';
import { Users, ResetPasswordCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { ResetPasswordEmail } from './ResetPasswordEmail';
import { Resend } from 'resend';
import { ResetPasswordEmailSchema } from './ResetPasswordEmail.z';
import { ZodError } from 'zod';

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_DOMAIN) {
	throw new Error('RESEND_API_KEY and EMAIL_DOMAIN are not set');
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email: string) {
	try {
		const { email: parsedEmail } = ResetPasswordEmailSchema.parse({ email });
		const user = await db
			.select()
			.from(Users)
			.where(eq(Users.email, parsedEmail))
			.limit(1);
		// SELECT * FROM Users WHERE email = $1 LIMIT 1, [parsedEmail]

		if (user.length === 0) {
			throw new Error('User not found');
		}
		if (!user[0].email_verified) {
			throw new Error('User account not activated');
		}

		const resetPasswordCode = crypto.randomBytes(32).toString('hex');

		await db.insert(ResetPasswordCodes).values({
			code: resetPasswordCode,
			user_id: user[0].user_id
		});
		// INSERT INTO ResetPasswordCodes (code, user_id) VALUES ($1, $2), [resetPasswordCode, user[0].user_id]

		const { data, error } = await resend.emails.send({
			from: `FOEP <foep@${process.env.EMAIL_DOMAIN}>`,
			to: [user[0].email],
			subject: 'Reset your password',
			react: ResetPasswordEmail({
				email: user[0].email,
				code: resetPasswordCode
			})
		});

		if (error) {
			// I should probably destroy the reset code here
			console.log('Error in resendResetPasswordEmail:', error);
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
				error.message === 'User account not activated' ||
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
			console.log('Error in resendResetPasswordEmail:', error);
		}

		return {
			success: false as const,
			message: 'An error occurred while sending the reset password email'
		};
	}
}
