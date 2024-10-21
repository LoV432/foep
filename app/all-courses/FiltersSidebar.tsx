'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider, SliderWithRange } from '@/components/ui/slider';
import { CoursesCategories } from '@/db/schema';
import { use, useState } from 'react';

export default function FiltersSidebar({
	categoriesPromise
}: {
	categoriesPromise: Promise<(typeof CoursesCategories.$inferSelect)[]>;
}) {
	const categories = use(categoriesPromise);
	const [search, setSearch] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
	const [minRating, setMinRating] = useState<number>(0);
	const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc'>('desc');
	return (
		<aside className="h-fit w-full space-y-6 rounded-lg border border-border p-6 md:w-1/4">
			<div>
				<Label className="mb-2 text-lg font-semibold" htmlFor="search">
					Search Courses
				</Label>
				<Input
					id="search"
					placeholder="Search..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Categories</h2>
				{categories.map((category) => (
					<div
						key={category.category_id}
						className="flex items-center space-x-2 pb-2"
					>
						<Checkbox
							className="rounded-[4px]"
							id={category.name}
							checked={selectedCategories.includes(category.category_id)}
							onCheckedChange={(checked) =>
								setSelectedCategories(
									checked
										? [...selectedCategories, category.category_id]
										: selectedCategories.filter(
												(c) => c !== category.category_id
											)
								)
							}
						/>
						<Label htmlFor={category.name}>{category.name}</Label>
					</div>
				))}
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Price Range</h2>
				<SliderWithRange
					min={0}
					max={200}
					step={1}
					value={priceRange}
					onValueChange={(value) => setPriceRange(value as [number, number])}
				/>
				<div className="mt-2 flex justify-between">
					<span>${priceRange[0]}</span>
					<span>${priceRange[1]}</span>
				</div>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Minimum Rating</h2>
				<Slider
					min={0}
					max={5}
					step={0.5}
					value={[minRating]}
					onValueChange={(value) => setMinRating(value[0])}
				/>
				<div className="mt-2">{minRating} stars and up</div>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Sort by Price</h2>
				<Button
					variant="outline"
					className="w-full justify-between"
					onClick={() => setSortByPrice(sortByPrice === 'asc' ? 'desc' : 'asc')}
				>
					{sortByPrice === 'asc' ? 'Price: Low to High' : 'Price: High to Low'}
				</Button>
			</div>
		</aside>
	);
}
