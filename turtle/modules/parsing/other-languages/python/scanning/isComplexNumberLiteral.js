export function isComplexNumberLiteral(s) {
	if (s === 'j')
		return false; // j is too short.

	return /^-?\d*\.?\d*j$/.test(s);
};