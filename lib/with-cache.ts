import { unstable_cache } from 'next/cache';

export async function withCache<T>(
	functionToCache: () => Promise<T>,
	keys: string[],
	ttl: number
) {
	function functionToCacheWithLog() {
		process.env.NODE_ENV === 'development' &&
			console.log('Cache Missed:', keys);
		return functionToCache();
	}
	return (await unstable_cache(functionToCacheWithLog, ['all-cache', ...keys], {
		revalidate: ttl,
		tags: ['all-cache', ...keys]
	})()) as T;
}
