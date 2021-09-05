export function first(val) {
	const result = val[0];
	if (result === undefined)
		return null;
	return result;
};