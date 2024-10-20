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
import { Users, VerificationCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ms from 'ms';

export default async function Page({ params }: { params: { code: string } }) {
	const code = params.code;
	try {
		const checkCode = await db
			.select()
			.from(VerificationCodes)
			.where(eq(VerificationCodes.code, code));
		if (checkCode.length === 0) {
			return <FailedVerification />;
		}
		if (Date.now() - checkCode[0].created_at.getTime() > ms('10m')) {
			return <FailedVerification />;
		}
		await db
			.update(Users)
			.set({
				email_verified: true
			})
			.where(eq(Users.user_id, checkCode[0].user_id));
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
						Email Verified!
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-muted-foreground">
						Your email has been successfully verified. You can now log in to
						your account and start using our services.
					</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button asChild className="w-full">
						<Link href="/login">Go to Login Page</Link>
					</Button>
				</CardFooter>
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
						Verification Failed
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-4 text-muted-foreground">
						We&apos;re sorry, but we couldn&apos;t verify your email address.
						This could be due to an expired or invalid verification link.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						asChild
						className="w-full bg-destructive hover:bg-destructive/90"
					>
						<Link href="/register/resend-verification">
							Resend Verification Email
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
