export function pick(a) {
	const index = Math.min(a.length - 1, Math.floor(Math.random() * a.length));
	return a[index];
};