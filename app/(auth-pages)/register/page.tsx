import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationForm from './Form';
import Logo from '@/components/Logo';

export default function RegistrationPage() {
	return (
		<div className="relative flex min-h-screen overflow-hidden">
			<div className="z-10 flex w-full flex-col items-center bg-primary p-6 pt-2 lg:w-[30%] lg:justify-center">
				<div className="flex flex-col items-center p-6 text-center">
					<Logo width={40} height={40} />
					<p className="mt-2 text-xl text-white lg:hidden">
						Expand your knowledge and skills from anywhere in the world
					</p>
				</div>
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-2xl font-bold text-foreground">
							Create your account
						</CardTitle>
					</CardHeader>
					<CardContent>
						<RegistrationForm />
					</CardContent>
				</Card>
			</div>
			<div className="relative z-10 hidden bg-muted lg:block lg:w-[70%]">
				<div className="flex h-full flex-col items-center justify-center p-8">
					<div className="max-w-2xl space-y-8 text-center">
						<Image
							src="/register.jpg"
							alt="Online Education"
							width={800}
							height={400}
							className="mb-8 h-auto w-full rounded-lg shadow-xl"
						/>
						<h1 className="text-4xl font-bold text-foreground">
							Fictional Online Education Platform
						</h1>
						<p className="text-xl text-foreground">
							Expand your knowledge and skills from anywhere in the world
						</p>
						<div className="flex justify-center space-x-4">
							<div className="flex items-center space-x-2">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="h-6 w-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<span className="text-foreground">1000+ Courses</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="h-6 w-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								</div>
								<span className="text-foreground">Expert Instructors</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
