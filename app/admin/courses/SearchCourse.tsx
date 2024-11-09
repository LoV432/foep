'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next13-progressbar';

export default function SearchCourse({
	initialSearch
}: {
	initialSearch?: string;
}) {
	const [search, setSearch] = useState(initialSearch || '');
	const router = useRouter();

	async function handleSearch() {
		router.push(`/admin/courses?q=${search}`);
	}

	return (
		<Input
			type="text"
			placeholder="Search"
			className="w-1/2 sm:w-auto"
			value={search}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					handleSearch();
				}
			}}
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
}
