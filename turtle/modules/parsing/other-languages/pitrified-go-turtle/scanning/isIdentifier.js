const pattern = /^[a-z\p{L}_][\p{L}a-z_\d]*$/iu;

export function isIdentifier(s) {
	return pattern.test(s);
};