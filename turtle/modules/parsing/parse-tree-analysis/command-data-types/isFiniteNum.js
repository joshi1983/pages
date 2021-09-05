export function isFiniteNum(type) {
	if (type === 'int' ||
		type === 'num(finite)')
		return true;

	if (typeof type !== 'string' ||
	!type.startsWith('num(finite') ||
	type.indexOf(')|') !== -1)
		return false;

	return true;
};