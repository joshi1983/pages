const cache = [];
let v = 1;
for (let i = 2; i < 171; i++) {
	v *= i;
	cache[i] = v;
}

export function factorial(n) {
	if (n < 2)
		return 1;
	if (n >= cache.length)
		return Infinity;
	return cache[n];
};