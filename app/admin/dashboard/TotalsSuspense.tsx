'use client';

import { use } from 'react';

export function TotalsSuspense({
	totals,
	isRevenue
}: {
	totals: Promise<{ total: number | null | string }>;
	isRevenue?: boolean;
}) {
	if (isRevenue) {
		return Number(use(totals).total).toFixed(2) || '0';
	} else {
		return use(totals).total;
	}
}
