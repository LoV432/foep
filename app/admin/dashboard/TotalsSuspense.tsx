'use client';

import { use } from 'react';

export function TotalsSuspense({
	totals
}: {
	totals: Promise<{ total: number | null | string }>;
}) {
	return use(totals).total ?? 0;
}
