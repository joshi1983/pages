import { factorial } from './factorial.js';

const cache = new Map();
const cacheSizeLimit = 100;

function key(n, k) {
	return `${n}-${k}`;
}

/*
Performs the combination calculation described at:
https://en.wikipedia.org/wiki/Combination
*/
export function nChooseK(n, k) {
	/*
	A few trivial cases to avoid unnecessary use of
	cache memory and calculation time.
	*/
	if (n === k || k <= 0)
		return 1;
	if (k > n)
		return 0;
	if (k === 1)
		return n;

	const cacheKey = key(n, k);
	let result = cache.get(cacheKey);
	if (result === undefined) {
		let top = n;
		const minTop = n + 1 - k;
		for (let i = n - 1; i >= minTop; i--) {
			top *= i;
		}
		let bottom = factorial(k);
		result = top / bottom;
		if (cache.size > cacheSizeLimit) {
			cache.clear();
			/*
			Reducing the size by just 1 element can be time consuming
			which reduces the benefit of caching.
			Instead, let's clear the entire cache every time it reaches capacity.
			This should be simpler and likely faster in amortized time.
			*/
		}
		cache.set(cacheKey, result);
	}
	return result;
};