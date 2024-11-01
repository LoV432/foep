import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { use } from 'react';
import type { Reviews } from './get-reviews';

export default function ReviewCards({ reviews }: { reviews: Reviews }) {
	return (
		<div className="mt-12 shadow sm:rounded-lg">
			<h2 className="mb-8 text-center text-3xl font-bold">Customer Reviews</h2>
			<div className="flex w-full flex-col justify-center gap-4">
				{use(reviews).data?.map((review, index) => (
					<ReviewCard key={index} review={review} />
				))}
			</div>
		</div>
	);
}

function ReviewCard({
	review
}: {
	review: { name: string | null; comment: string | null; stars: number };
}) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">
						{review.name || 'Anonymous'}
					</CardTitle>
					<StarRating rating={review.stars} />
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">
					{review.comment || 'No comment'}
				</p>
			</CardContent>
		</Card>
	);
}

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
			{[...Array(5)].map((_, i) => (
				<Star
					key={i}
					className={`h-5 w-5 ${
						i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
					}`}
				/>
			))}
		</div>
	);
}
