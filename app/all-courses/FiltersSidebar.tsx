import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { db } from '@/db/db';
import { CoursesCategories } from '@/db/schema';

export default async function FiltersSidebar() {
	const categories = await db.select().from(CoursesCategories);
	return (
		<aside className="h-fit w-full space-y-6 rounded-lg border border-border p-6 md:w-1/4">
			<div>
				<Label className="mb-2 text-lg font-semibold" htmlFor="search">
					Search Courses
				</Label>
				<Input id="search" placeholder="Search..." />
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Categories</h2>
				{categories.map((category) => (
					<div
						key={category.category_id}
						className="flex items-center space-x-2 pb-2"
					>
						<Checkbox className="rounded-[4px]" id={category.name} />
						<Label htmlFor={category.name}>{category.name}</Label>
					</div>
				))}
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Price Range</h2>
				<Slider min={0} max={200} step={1} />
				<div className="mt-2 flex justify-between">
					<span>$0</span>
					<span>$200</span>
				</div>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Minimum Rating</h2>
				<Slider min={0} max={5} step={0.5} />
				<div className="mt-2">0 stars and up</div>
			</div>
			<div>
				<h2 className="mb-2 text-lg font-semibold">Sort by Price</h2>
				<Button variant="outline" className="w-full justify-between">
					Price: High to Low
				</Button>
			</div>
		</aside>
	);
}
