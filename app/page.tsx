import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Home | FOEP',
	description: 'FOEP - Fictional Online Education Platform'
};

export default async function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<section className="bg-gradient-to-b from-primary/10 to-background px-4 py-5 md:px-6 lg:px-8">
				<div className="container mx-auto max-w-6xl">
					<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
						<div className="space-y-6">
							<h1 className="text-4xl font-bold text-primary md:text-5xl">
								Empower Your Future with Online Learning
							</h1>
							<p className="text-xl text-foreground">
								Discover a world of knowledge at your fingertips. Our platform
								offers cutting-edge courses designed to help you achieve your
								goals and advance your career.
							</p>
							<Button
								asChild
								size="lg"
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Link href="/all-courses">Explore Courses</Link>
							</Button>
						</div>
						<div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
							<Image
								loading="eager"
								src="/home-page.svg"
								alt="Online learning illustration"
								fill
								className="hidden rounded-lg md:block"
							/>
							<Image
								loading="eager"
								src="/home-page-mobile.svg"
								alt="Online learning illustration"
								fill
								className="block rounded-lg md:hidden"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-secondary px-4 py-20 md:px-6 lg:px-8">
				<div className="container mx-auto max-w-6xl">
					<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
						<Card className="bg-card text-card-foreground">
							<CardContent className="p-6 text-center">
								<h2 className="mb-2 text-4xl font-bold text-primary">1000+</h2>
								<p className="text-lg text-muted-foreground">
									Courses Available
								</p>
							</CardContent>
						</Card>
						<Card className="bg-card text-card-foreground">
							<CardContent className="p-6 text-center">
								<h2 className="mb-2 text-4xl font-bold text-primary">500+</h2>
								<p className="text-lg text-muted-foreground">
									Expert Instructors
								</p>
							</CardContent>
						</Card>
						<Card className="bg-card text-card-foreground">
							<CardContent className="p-6 text-center">
								<h2 className="mb-2 text-4xl font-bold text-primary">100k+</h2>
								<p className="text-lg text-muted-foreground">Active Learners</p>
							</CardContent>
						</Card>
					</div>
					<Card className="bg-primary text-primary-foreground">
						<CardContent className="p-8 text-center">
							<h2 className="mb-6 text-3xl font-bold">
								Ready to Start Your Learning Journey?
							</h2>
							<Button
								asChild
								size="lg"
								variant="secondary"
								className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
							>
								<Link href="/all-courses">View All Courses</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
