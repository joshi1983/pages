const numTypes = new Set(['int', 'num', 'num(finite)', 'num(unfinite)']);

export function isNum(type) {
	return numTypes.has(type);
};