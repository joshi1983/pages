const intTypes = new Set([
	'Byte', 'Int', 'Long', 'Short'
]);
const floatTypes = new Set([
	'Double', 'Float'
]);

export function isNumericType(s) {
	return intTypes.has(s) ||
		floatTypes.has(s);
};