import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { db } from '@/db/db';
import { Users, ResetPasswordCodes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import ms from 'ms';
import { ResetPasswordForm } from './ResetPasswordForm';

export default async function Page({ params }: { params: { code: string } }) {
	const code = params.code;
	let user;
	try {
		const checkCode = await db
			.select()
			.from(ResetPasswordCodes)
			.where(
				and(
					eq(ResetPasswordCodes.code, code),
					eq(ResetPasswordCodes.used, false)
				)
			);
		// SELECT * FROM ResetPasswordCodes WHERE code = $1 AND used = false

		if (checkCode.length === 0) {
			return <FailedVerification />;
		}

		if (Date.now() - checkCode[0].created_at.getTime() > ms('10m')) {
			return <FailedVerification />;
		}

		user = await db
			.select({ email: Users.email })
			.from(Users)
			.where(eq(Users.user_id, checkCode[0].user_id));
		// SELECT email FROM Users WHERE user_id = $1
	} catch {
		return <FailedVerification />;
	}
	return (
		<div className="flex min-h-screen items-center justify-center bg-secondary">
			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/40 blur-3xl"></div>
				<div className="absolute bottom-[30%] right-[15%] h-64 w-64 rounded-full bg-primary/40 blur-3xl"></div>
			</div>
			<Card className="z-10 w-full max-w-md shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
						<CheckCircle className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold text-primary">
						Reset Password for {user[0].email}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						You can now reset your password by entering a new password below.
					</p>
					<ResetPasswordForm code={code} />
				</CardContent>
			</Card>
		</div>
	);
}

function FailedVerification() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-secondary">
			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-destructive/20 blur-3xl"></div>
				<div className="absolute bottom-[30%] right-[15%] h-64 w-64 rounded-full bg-destructive/20 blur-3xl"></div>
			</div>
			<Card className="z-10 w-full max-w-md shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
						<XCircle className="h-10 w-10 text-destructive" />
					</div>
					<CardTitle className="text-2xl font-bold text-destructive">
						Reset Password Failed
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-4 text-muted-foreground">
						We're sorry, but we couldn't reset your password. This could be due
						to an expired or invalid reset password link.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						asChild
						className="w-full bg-destructive hover:bg-destructive/90"
					>
						<Link href="/login/reset-password">Send Reset Password Email</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
