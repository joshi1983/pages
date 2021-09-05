const floatTypes = new Set([
	'float32', 'float64'
]);

export function isFloatType(s) {
	return floatTypes.has(s);
};