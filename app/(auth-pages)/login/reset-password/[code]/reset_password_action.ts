'use server';

import { db } from '@/db/db';
import { ResetPasswordCodes, Users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ResetPasswordSchema } from './ResetPassword.z';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import ms from 'ms';

export async function resetPasswordAction({
	code,
	values
}: {
	code: string;
	values: z.infer<typeof ResetPasswordSchema>;
}) {
	try {
		const { password: parsedPassword } = ResetPasswordSchema.parse(values);

		const resetCode = await db
			.select()
			.from(ResetPasswordCodes)
			.where(
				and(
					eq(ResetPasswordCodes.code, code),
					eq(ResetPasswordCodes.used, false)
				)
			)
			.limit(1);
		// SELECT * FROM ResetPasswordCodes WHERE code = $1 AND used = false, [code]

		if (resetCode.length === 0) {
			throw new Error('Invalid reset code');
		}

		if (Date.now() - resetCode[0].created_at.getTime() > ms('10m')) {
			throw new Error('Invalid reset code');
		}

		const user = await db
			.select()
			.from(Users)
			.where(eq(Users.user_id, resetCode[0].user_id))
			.limit(1);
		// SELECT * FROM Users WHERE user_id = $1 LIMIT 1, [resetCode[0].user_id]

		if (user.length === 0) {
			throw new Error('User not found');
		}

		const hashedPassword = await bcrypt.hash(parsedPassword, 10);
		await db.transaction(async (tx) => {
			await tx
				.update(Users)
				.set({ password: hashedPassword })
				.where(eq(Users.user_id, user[0].user_id));
			// UPDATE Users SET password = $1 WHERE user_id = $2, [hashedPassword, user[0].user_id]

			await tx
				.update(ResetPasswordCodes)
				.set({ used: true })
				.where(eq(ResetPasswordCodes.code, code));
			// UPDATE ResetPasswordCodes SET used = true WHERE code = $1, [code]
		});
		return { success: true as const, message: 'Password reset successfully' };
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Invalid reset code') {
				return {
					success: false as const,
					message: error.message
				};
			}
		}
		console.error(error);
		return {
			success: false as const,
			message: 'Something went wrong, please try again'
		};
	}
}
