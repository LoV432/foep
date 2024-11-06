import { unstable_cache } from 'next/cache';

export async function withCache<T>(
	functionToCache: () => Promise<T>,
	keys: string[],
	ttl = 7 * 24 * 60 * 60
) {
	function functionToCacheWithLog() {
		if (process.env.NODE_ENV === 'development')
			console.log('Cache Missed:', keys);

		return functionToCache();
	}
	return (await unstable_cache(functionToCacheWithLog, ['all-cache', ...keys], {
		revalidate: ttl,
		tags: ['all-cache', ...keys]
	})()) as T;
}
