'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createReview } from './review-action';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function ReviewForm({
	courseId,
	slug,
	previousReview
}: {
	courseId: number;
	slug: string;
	previousReview?: {
		rating: number;
		comment: string | null;
	} | null;
}) {
	const { toast } = useToast();
	const [rating, setRating] = useState(previousReview?.rating || 0);
	const [review, setReview] = useState(previousReview?.comment || '');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	async function handleReviewSubmit() {
		try {
			setIsLoading(true);
			const response = await createReview(courseId, {
				stars: rating,
				review
			});
			if (!response.success) {
				throw new Error(response.error);
			}
			setRating(response.data.rating);
			setReview(response.data.comment || '');
			toast({
				title: 'Success',
				description: 'Thank you for your review!',
				variant: 'default'
			});
			router.push(`/course/${slug}`);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Error submitting review',
				variant: 'destructive'
			});
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<div className="space-y-4">
			<div className="space-y-4">
				<div>
					<h3 className="mb-2 text-lg font-medium">Rate your experience:</h3>
					<div className="flex space-x-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`h-8 w-8 cursor-pointer ${
									star <= rating
										? 'fill-yellow-500 text-yellow-500'
										: 'text-gray-300'
								}`}
								onClick={() => setRating(star)}
							/>
						))}
					</div>
				</div>
				<div>
					<h3 className="mb-2 text-lg font-medium">
						Leave a review (optional):
					</h3>
					<Textarea
						placeholder="Share your thoughts about the course..."
						value={review}
						onChange={(e) => setReview(e.target.value)}
						rows={4}
					/>
				</div>
			</div>
			<Button
				onClick={handleReviewSubmit}
				className="w-full"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						Submitting... <Loader2 className="mr-2 h-4 w-4 animate-spin" />
					</>
				) : (
					'Submit Review'
				)}
			</Button>
			<Button asChild variant="outline" className="w-full">
				<Link href={`/course/${slug}`}>Skip Review</Link>
			</Button>
		</div>
	);
}
