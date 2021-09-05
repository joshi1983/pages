export function unwrapStringValue(s) {
	let result = s.trim().substring(1);
	if (result.endsWith('\'')) // for long string literals.
		result = result.substring(0, result.length - 1);
	return result;
};