export function numeric(s) {
	if (s === '')
		return 'A numeric string must not be empty.';
	const result = Number(s);
	if (isNaN(result))
		return `Invalid number "${s}"`;
};