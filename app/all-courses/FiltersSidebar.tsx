import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider, SliderWithRange } from '@/components/ui/slider';
import { CoursesCategories } from '@/db/schema';
import { use } from 'react';
import { UpdateFiltersAction } from './Main';
import { filtersSchema } from './Filters.z';
import { z } from 'zod';

export default function FiltersSidebar({
	categoriesPromise,
	dispatchFilters,
	filtersState,
	setQueryFilters
}: {
	categoriesPromise: Promise<(typeof CoursesCategories.$inferSelect)[]>;
	dispatchFilters: React.Dispatch<UpdateFiltersAction>;
	filtersState: z.infer<typeof filtersSchema>;
	setQueryFilters: React.Dispatch<
		React.SetStateAction<z.infer<typeof filtersSchema>>
	>;
}) {
	const categories = use(categoriesPromise);

	function applyFilter() {
		try {
			const filters = filtersSchema.parse(filtersState);
			filters.page = 1;
			dispatchFilters(filters);
			setQueryFilters(filters);
		} catch (error) {
			console.error(error);
		}
	}

	function clearFilters() {
		const filters = filtersSchema.parse({ page: 1 });
		dispatchFilters(filters);
		setQueryFilters(filters);
	}

	return (
		<aside className="h-fit w-full space-y-6 rounded-lg border border-border p-6 lg:w-1/4">
			<div>
				<Label className="mb-2 text-lg font-semibold" htmlFor="search">
					Search Courses
				</Label>
				<Input
					id="search"
					placeholder="Search..."
					value={filtersState.search}
					onChange={(e) => dispatchFilters({ search: e.target.value })}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							applyFilter();
						}
					}}
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
							checked={filtersState.selectedCategories.includes(
								category.category_id
							)}
							onCheckedChange={(checked) =>
								dispatchFilters({
									selectedCategories: checked
										? [...filtersState.selectedCategories, category.category_id]
										: filtersState.selectedCategories.filter(
												(c) => c !== category.category_id
											)
								})
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
					value={filtersState.priceRange}
					onValueChange={(value) =>
						dispatchFilters({ priceRange: value as [number, number] })
					}
				/>
				<div className="mt-2 flex justify-between">
					<span>${filtersState.priceRange[0]}</span>
					<span>${filtersState.priceRange[1]}</span>
				</div>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Minimum Rating</h2>
				<Slider
					min={0}
					max={5}
					step={1}
					value={[filtersState.minRating]}
					onValueChange={(value) => dispatchFilters({ minRating: value[0] })}
				/>
				<div className="mt-2">{filtersState.minRating} stars and up</div>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Sort by Price</h2>
				<Button
					variant="outline"
					className="w-full justify-between"
					onClick={() =>
						dispatchFilters({
							sortByPrice: filtersState.sortByPrice === 'asc' ? 'desc' : 'asc'
						})
					}
				>
					{filtersState.sortByPrice === 'asc'
						? 'Price: Low to High'
						: 'Price: High to Low'}
				</Button>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button onClick={applyFilter}>Apply Filters</Button>
				<Button variant="destructive" onClick={clearFilters}>
					Clear Filters
				</Button>
			</div>
		</aside>
	);
}
