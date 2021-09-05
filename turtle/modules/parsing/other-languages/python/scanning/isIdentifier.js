export function isIdentifier(s) {
	return /^[a-z_][a-z_\d]*$/i.test(s);
};