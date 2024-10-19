'use server';

import { z, ZodError } from 'zod';
import { registerFormSchema } from './FormSchema.z';
import bcrypt from 'bcrypt';
import { db } from '@/db/db';
import { Users, VerificationCodes } from '@/db/schema';
import { DatabaseError } from 'pg';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { VerificationEmail } from './VerificationEmail';

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_DOMAIN) {
	throw new Error('Please add RESEND_API_KEY and EMAIL_DOMAIN env');
}
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function registerAction({
	fields
}: {
	fields: z.infer<typeof registerFormSchema>;
}) {
	try {
		const validatedFields = registerFormSchema.parse(fields);
		const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

		// I am using a transaction to ensure that the user and verification code are created in the same action
		// Incase the user is created but the verification code fails to be created
		// Technically this isn't really an issue since user can resend the verification email
		// But eh, why not i guess

		// pg.query('BEGIN')
		const userTransaction = await db.transaction(async (tx) => {
			const newUser = await tx
				.insert(Users)
				.values({
					email: validatedFields.email,
					password: hashedPassword,
					name: validatedFields.name
				})
				.returning({ id: Users.user_id });
			// INSERT INTO Users (email, password, name) VALUES ($1, $2, $3) RETURNING user_id, [validatedFields.email, hashedPassword, validatedFields.name]

			const emailVerificationCde = randomBytes(32).toString('hex');
			const emailCode = await db
				.insert(VerificationCodes)
				.values({
					user_id: newUser[0].id,
					code: emailVerificationCde
				})
				.returning({ VerificationCode: VerificationCodes.code });
			// INSERT INTO VerificationCodes (user_id, code) VALUES ($1, $2) RETURNING code, [newUser[0].id, emailVerificationCde]

			return {
				userId: newUser[0].id,
				verificationCode: emailCode[0].VerificationCode
			};
		});
		// pg.query('COMMIT')

		resend.emails.send({
			// We aren't going to wait for the email to be sent
			// We will allow the user to resend the email in the event of failure
			from: `FOEP <foep@${process.env.EMAIL_DOMAIN}>`,
			to: [validatedFields.email],
			subject: 'Verify your email',
			react: VerificationEmail({
				name: validatedFields.name,
				email: validatedFields.email,
				code: userTransaction.verificationCode
			})
		});

		return {
			success: true,
			message:
				'Account created successfully. Please check your email for verification.'
		};
	} catch (error) {
		// pg.query('ROLLBACK')
		if (error instanceof ZodError) {
			// Technically i can send specific errors from here but should user be told what failed
			// When they are clearly try to bypass the form checks?
			console.log(error.issues);
		} else if (error instanceof DatabaseError) {
			if (error.code === '23505') {
				return {
					success: false,
					message: 'User already exists. Please login instead.'
				};
			}
		} else {
			console.log(error);
		}
		return {
			success: false,
			message: 'Something went wrong. Please try again'
		};
	}
}
