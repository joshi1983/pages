const regex = /^[_a-z][a-z_0-9]*$/i;

export function isValidIdentifier(s) {
	return regex.test(s);
};