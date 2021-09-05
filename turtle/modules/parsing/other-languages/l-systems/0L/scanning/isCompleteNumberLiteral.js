const pattern = /^-?\d*(\.\d*)?$/;

const notValues = new Set([
	'', '.', '-', '-.'
]);

export function isCompleteNumberLiteral(s) {
	if (notValues.has(s))
		return false;
	return pattern.test(s);
};