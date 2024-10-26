import { z } from 'zod';

export const filtersSchema = z.object({
	search: z.string().default(''),
	selectedCategories: z.array(z.number()).default([]),
	priceRange: z.array(z.number()).default([0, 200]),
	minRating: z.number().min(0).max(5).default(0),
	sortByPrice: z.enum(['asc', 'desc']).default('desc'),
	page: z.number().min(1).default(1),
	pageSize: z.number().min(1).max(50).default(12)
});
