const numTypes = new Set(['int', 'num', 'num(finite)', 'num(unfinite)']);

export function isNum(type) {
	if (numTypes.has(type))
		return true;

	if (typeof type !== 'string' ||
	!type.startsWith('num(') ||
	type.indexOf(')|') !== -1)
		return false;

	return true; // For example, num(min=0), num(finite,min=0)...
};