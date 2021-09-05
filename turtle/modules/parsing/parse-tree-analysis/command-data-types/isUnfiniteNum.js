export function isUnfiniteNum(type) {
	if (!type.startsWith('num(unfinite') ||
	type.indexOf(')|') !== -1)
		return false;

	return true;
};