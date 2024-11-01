'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { enrollAction } from './enroll-action';
import { useToast } from '@/hooks/use-toast';
import { CourseEnrollments } from '@/db/schema';

export function EnrollmentButton({
	courseId,
	slug,
	isLoggedIn,
	enrollment
}: {
	courseId: number;
	slug: string;
	isLoggedIn: boolean;
	enrollment:
		| (typeof CourseEnrollments.$inferSelect & { chapterType: string })
		| undefined;
}) {
	const [showDialog, setShowDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	async function handleEnroll() {
		try {
			setLoading(true);
			const response = await enrollAction(courseId);

			if (!response.success) {
				throw new Error(response.error);
			}
			setShowDialog(false);
			toast({
				title: 'Enrolled in course',
				description: 'Redirecting to course',
				variant: 'default'
			});
			router.push(
				`/course/${slug}/chapter/${response.data.current_chapter_id}/${response.data.chapterType}`
			);
		} catch (error) {
			if (error instanceof Error && error.message === 'Unauthorized') {
				toast({
					title: 'You must be logged in to enroll',
					description: 'Redirecting to login page',
					variant: 'destructive'
				});
				router.push('/login');
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Button
				className="mt-4 w-full"
				size="lg"
				onClick={() => {
					if (!isLoggedIn) {
						toast({
							title: 'You must be logged in to enroll',
							description: 'Redirecting to login page',
							variant: 'destructive'
						});
						router.push('/login');
					} else if (enrollment) {
						router.push(
							`/course/${slug}/chapter/${enrollment.current_chapter_id}/${enrollment.chapterType}`
						);
					} else {
						setShowDialog(true);
					}
				}}
			>
				{enrollment ? 'Continue Course' : 'Enroll Now'}
			</Button>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Enrollment</DialogTitle>
						<DialogDescription>
							Are you sure you want to enroll in this course?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleEnroll} disabled={loading}>
							{loading ? 'Enrolling...' : 'Confirm'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
